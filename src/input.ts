import { Camera, type CanvasRenderer } from "./renderer.ts";
import type { Layout } from "./layout.ts";
import { type Hex, Point } from "./coordinates.ts";

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private renderer: CanvasRenderer;
  private layout: Layout;
  private camera: Camera;
  private hovered: Hex | null = null;
  private selected: Hex | null = null;

  private isPanning = false;
  private lastMouse: Point | null = null;

  private readonly zoomStep = 1.1;
  private readonly minZoom = 0.1;
  private readonly maxZoom = 20;

  constructor(
    canvas: HTMLCanvasElement,
    renderer: CanvasRenderer,
    layout: Layout,
    camera: Camera,
  ) {
    this.canvas = canvas;
    this.renderer = renderer;
    this.layout = layout;
    this.camera = camera;
  }

  attach() {
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("mouseleave", this.onMouseLeave);
    this.canvas.addEventListener("click", this.onClick);
    this.canvas.addEventListener("wheel", this.onWheel, {
      passive: true,
    });
  }

  detach() {
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.canvas.removeEventListener("mouseup", this.onMouseUp);
    this.canvas.removeEventListener("mouseleave", this.onMouseLeave);
    this.canvas.removeEventListener("click", this.onClick);
    this.canvas.removeEventListener("wheel", this.onWheel);
  }

  getMousePoint = (evt: MouseEvent | WheelEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    return new Point(evt.clientX - rect.left, evt.clientY - rect.top);
  };

  onMouseDown = (evt: MouseEvent) => {
    if (evt.button === 0 || evt.button === 1) {
      this.isPanning = true;
      this.lastMouse = this.getMousePoint(evt);
    }
  };

  onMouseMove = (evt: MouseEvent) => {
    const p = this.getMousePoint(evt);

    if (this.isPanning && this.lastMouse) {
      const dxScreen = p.x - this.lastMouse.x;
      const dyScreen = p.y - this.lastMouse.y;
      const invZoom = 1 / this.camera.getZoom();
      this.camera.pan(-dxScreen * invZoom, -dyScreen * invZoom);
      this.lastMouse = p;
    }
  };

  onMouseUp = (_: MouseEvent) => {
    this.isPanning = false;
    this.lastMouse = null;
  };

  onMouseLeave = (_: MouseEvent) => {
    this.isPanning = false;
    this.lastMouse = null;
  };

  onClick = (evt: MouseEvent) => {
    const p = this.getMousePoint(evt);
    this.selected = this.screenToHex(p);
  };

  onWheel = (evt: WheelEvent) => {
    const anchor = this.getMousePoint(evt);
    const current = this.camera.getZoom();
    const factor = evt.deltaY < 0 ? this.zoomStep : 1 / this.zoomStep;
    const next = Math.min(
      this.maxZoom,
      Math.max(this.minZoom, current * factor),
    );
    this.camera.setZoom(next, anchor);
  };

  screenToHex(p: Point) {
    const world = this.camera.screenToWorld(p);
    const frac = this.layout.pixelToHex(world);
    return frac.round();
  }

  getSelected() {
    return this.selected;
  }

  getHovered() {
    return this.hovered;
  }
}
