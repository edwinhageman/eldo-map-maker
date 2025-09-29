import type { Layout } from "./layout.ts";
import { type Hex, Point } from "./coordinates.ts";
import type { HexGrid } from "./grid.ts";
import type { InputHandler } from "./input.ts";
import { HexTile } from "./tile.ts";

export class CanvasRenderer {
  private readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private layout: Layout;
  private camera: Camera;

  constructor(canvas: HTMLCanvasElement, layout: Layout, camera: Camera) {
    this.canvas = canvas;
    const _ctx = canvas.getContext("2d");
    if (_ctx === null) {
      throw Error("No canvas context available");
    }
    this.ctx = _ctx;
    this.layout = layout;
    this.camera = camera;

    // this.canvas.width = window.innerWidth;
    // this.canvas.height = window.innerHeight;

    const dpr = window.devicePixelRatio;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    //
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  clear() {
    // render background
    this.ctx.fillStyle = "rgb(247 247 247)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawHex(tile: HexTile) {
    this.pathHex(tile.hex);
    this.ctx.strokeStyle = "#333";
    this.ctx.lineWidth = 0.2;
    this.ctx.stroke();
    if (tile.type === "selected") {
      this.ctx.fillStyle = "#000";
      this.ctx.fill();
      this.ctx.fillStyle = "rgb(247 247 247)";
    }
  }

  drawGrid(grid: HexGrid) {
    grid.forEach((tile) => this.drawHex(tile));
  }

  drawLabel(h: Hex, text: string) {
    const centerWorld = this.layout.hexToPixel(h);
    const centerScreen = this.toScreen(centerWorld);
    this.ctx.fillStyle = "#000";
    this.ctx.font = "12px system-ui";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, centerScreen.x, centerScreen.y);
  }

  setLayout(layout: Layout) {
    this.layout = layout;
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }

  toScreen(point: Point) {
    return this.camera.worldToScreen(point);
  }

  pathHex(hex: Hex) {
    const cornersWorld = this.layout.polygonCorners(hex);
    if (cornersWorld.length !== 6) return;

    const first = this.toScreen(cornersWorld[0]);
    this.ctx.beginPath();
    this.ctx.moveTo(first.x, first.y);

    for (let i = 1; i < 6; i++) {
      const p = this.toScreen(cornersWorld[i]);
      this.ctx.lineTo(p.x, p.y);
    }
    this.ctx.closePath();
  }
}

export class Camera {
  private position: Point;
  private zoom: number;

  constructor(position?: Point, zoom?: number) {
    this.position = position ?? new Point(0, 0);
    this.zoom = zoom ?? 1;
  }

  worldToScreen(point: Point) {
    const x = (point.x - this.position.x) * this.zoom;
    const y = (point.y - this.position.y) * this.zoom;
    return new Point(x, y);
  }

  screenToWorld(point: Point) {
    const inv = 1 / this.zoom;
    const x = this.position.x + point.x * inv;
    const y = this.position.y + point.y * inv;
    console.log(point.x, point.y, inv, x, y);
    return new Point(x, y);
  }

  pan(dx: number, dy: number) {
    this.position = this.position.add(new Point(dx, dy));
  }

  setZoom(nextZoom: number, anchor?: Point) {
    const clamped = Math.max(0.0001, nextZoom);
    if (!anchor) {
      this.zoom = clamped;
      return;
    }
    // Keep anchor's world position stable: compute world at old zoom, then adjust position for new zoom.
    const worldAtAnchor = this.screenToWorld(anchor);
    this.zoom = clamped;
    const newWorldAtAnchor = this.screenToWorld(anchor);
    const dx = worldAtAnchor.x - newWorldAtAnchor.x;
    const dy = worldAtAnchor.y - newWorldAtAnchor.y;
    this.pan(dx, dy);
  }

  public getZoom() {
    return this.zoom;
  }

  public getPosition() {
    return this.position;
  }

  public setPosition(point: Point) {
    this.position = point;
  }
}

export class RenderLoop {
  private renderer: CanvasRenderer;
  private input: InputHandler;
  private readonly grid: HexGrid;
  private requestId: number | null = null;

  private readonly tick = (time: number) => this.frame(time);

  private readonly onUpdate?: (dt: number) => void;
  private lastTime: number | null = null;

  constructor(
    renderer: CanvasRenderer,
    input: InputHandler,
    grid: HexGrid,
    onUpdate?: (dt: number) => void,
  ) {
    this.renderer = renderer;
    this.input = input;
    this.grid = grid;
    this.onUpdate = onUpdate;
  }

  start() {
    if (this.requestId === null) {
      this.lastTime = null;
      this.requestId = requestAnimationFrame(this.tick);
    }
  }

  stop() {
    if (this.requestId !== null) {
      window.cancelAnimationFrame(this.requestId);
      this.requestId = null;
      this.lastTime = null;
    }
  }

  isRunning() {
    return this.requestId !== null;
  }

  frame(time: number) {
    const dt = this.lastTime === null ? 0 : (time - this.lastTime) / 1000;
    this.lastTime = time;

    if (this.onUpdate) {
      this.onUpdate(dt);
    }

    this.renderer.clear();
    this.renderer.drawGrid(this.grid);

    const selected = this.input.getSelected();
    if (selected && this.grid.has(selected)) {
      const tile = this.grid.get(selected)!;
      this.renderer.drawHex(new HexTile(tile.hex, "selected", 1));
    }

    this.requestId = requestAnimationFrame(this.tick);
  }
}
