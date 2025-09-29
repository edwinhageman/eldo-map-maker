import { Hex } from "./coordinates.ts";
import type { HexTile } from "./tile.ts";

export class HexGrid {
  private static readonly DIRECTIONS: Hex[] = [
    new Hex(1, 0),
    new Hex(1, -1),
    new Hex(0, -1),
    new Hex(-1, 0),
    new Hex(-1, 1),
    new Hex(0, 1),
  ];

  private readonly _grid = new Map<string, HexTile>();
  private readonly _radius: number | undefined;

  constructor(radius?: number) {
    this._radius = radius;
  }

  public keyOf(hex: Hex) {
    return `${hex.q},${hex.r}`;
  }

  public size() {
    return this._grid.size;
  }

  public has(hex: Hex) {
    return this._grid.has(this.keyOf(hex));
  }

  public get(hex: Hex) {
    return this._grid.get(this.keyOf(hex));
  }

  public add(hex: Hex, tile: HexTile) {
    if (this._radius !== undefined && !this.inBounds(hex)) {
      return;
    }
    this._grid.set(this.keyOf(hex), tile);
  }

  public delete(hex: Hex) {
    this._grid.delete(this.keyOf(hex));
  }

  public clear() {
    this._grid.clear();
  }

  public neighbours(hex: Hex) {
    return HexGrid.DIRECTIONS.map((direction) => hex.add(direction));
  }

  public inBounds(hex: Hex) {
    if (this._radius === undefined) {
      return true;
    }
    const q = Math.abs(hex.q);
    const r = Math.abs(hex.r);
    const s = Math.abs(hex.s);
    const dist = (q + r + s) / 2;
    return dist <= this._radius;
  }

  public keys() {
    return this._grid.keys();
  }

  public values() {
    return this._grid.values();
  }

  public forEach(callback: (tile: HexTile) => void) {
    this._grid.forEach((tile) => {
      callback(tile);
    });
  }
}
