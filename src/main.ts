import "./style.css";
import { Camera, CanvasRenderer, RenderLoop } from "./renderer.ts";
import { HexGrid } from "./grid.ts";
import { Layout, Orientation } from "./layout.ts";
import { Hex, Point } from "./coordinates.ts";
import { HexTile } from "./tile.ts";
import { InputHandler } from "./input.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas id="canvas"></canvas>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

const camera = new Camera();
camera.setPosition(new Point(-20, -8));
camera.setZoom(7);

const layout = new Layout(
  Orientation.flatTop(),
  new Point(1, 1),
  new Point(0, 0),
);
const renderer = new CanvasRenderer(canvas, layout, camera);
const grid = new HexGrid();

const h1 = new Hex(0, 0);
grid.add(h1, new HexTile(h1, "f", 1));
const h2 = new Hex(1, 0);
grid.add(h2, new HexTile(h2, "f", 1));
const h3 = new Hex(1, -1);
grid.add(h3, new HexTile(h3, "f", 1));
const h4 = new Hex(0, -1);
grid.add(h4, new HexTile(h4, "f", 1));
const h5 = new Hex(-1, 0);
grid.add(h5, new HexTile(h5, "f", 1));
const h6 = new Hex(-1, 1);
grid.add(h6, new HexTile(h6, "f", 1));
const h7 = new Hex(0, 1);
grid.add(h7, new HexTile(h7, "f", 1));

const input = new InputHandler(canvas, renderer, layout, camera);
input.attach();
const loop = new RenderLoop(renderer, input, grid);
loop.start();
