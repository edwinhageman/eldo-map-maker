import { describe, expect, it } from "vitest";
import { HexGrid } from "./grid.ts";
import { HexTile } from "./tile.ts";
import { Hex } from "./coordinates.ts";

describe("HexGrid tests", () => {
  it("size() should return the number of tiles added to the grid", () => {
    const grid = new HexGrid();
    expect(grid.size()).toBe(0);

    const h1 = new Hex(0, 0);
    grid.add(h1, new HexTile(h1, "L", 1));
    expect(grid.size()).toBe(1);

    const h2 = new Hex(1, 1);
    grid.add(h2, new HexTile(h1, "L", 1));
    expect(grid.size()).toBe(2);

    // overwrite hex should not increase size
    grid.add(h2, new HexTile(h1, "L", 1));
    expect(grid.size()).toBe(2);
  });

  it("has / get should work with keys", () => {
    const grid = new HexGrid();

    const h = new Hex(0, 0);
    expect(grid.has(h)).toBe(false);
    expect(grid.get(h)).toBeUndefined();

    const tile = new HexTile(h, "L", 1);
    grid.add(h, tile);
    expect(grid.has(h)).toBe(true);
    expect(grid.get(h)).toBe(tile);
  });

  it("delete and clear should update size", () => {
    const grid = new HexGrid();
    const h1 = new Hex(0, 0);
    const h2 = new Hex(1, 1);
    grid.add(h1, new HexTile(h1, "L", 1));
    grid.add(h2, new HexTile(h2, "L", 2));
    expect(grid.size()).toBe(2);

    grid.delete(h1);
    expect(grid.size()).toBe(1);

    grid.clear();
    expect(grid.size()).toBe(0);
  });

  it("neighbours should return 6 neighbouring hexes", () => {
    const grid = new HexGrid();
    const h = new Hex(0, 0);
    const neighbours = grid.neighbours(h);
    expect(neighbours.length).toBe(6);

    const expected = [
      new Hex(1, 0),
      new Hex(1, -1),
      new Hex(0, -1),
      new Hex(-1, 0),
      new Hex(-1, 1),
      new Hex(0, 1),
    ];

    expected.forEach((h) => {
      expect(neighbours.some((n) => n.equals(h))).toBe(true);
    });
  });

  it("inBounds should be true when grid has no defined radius", () => {
    const grid = new HexGrid();
    expect(grid.inBounds(new Hex(10, 23))).toBe(true);
  });

  it("inBounds should respect provided radius", () => {
    const grid = new HexGrid(2);

    expect(grid.inBounds(new Hex(0, 0))).toBe(true);
    expect(grid.inBounds(new Hex(1, 0))).toBe(true);
    expect(grid.inBounds(new Hex(1, -1))).toBe(true);
    expect(grid.inBounds(new Hex(2, 0))).toBe(true);
    expect(grid.inBounds(new Hex(0, -2))).toBe(true);

    expect(grid.inBounds(new Hex(3, 0))).toBe(false);
    expect(grid.inBounds(new Hex(0, 3))).toBe(false);
  });

  it("keys, values, forEach should iterate over grid tiles", () => {
    const grid = new HexGrid();
    const h1 = new Hex(0, 0);
    const h2 = new Hex(1, 1);
    const t1 = new HexTile(h1, "L", 1);
    const t2 = new HexTile(h2, "L", 2);
    grid.add(h1, t1);
    grid.add(h2, t2);

    const keys = Array.from(grid.keys());
    expect(keys.length).toBe(2);
    expect(keys).toContain(`${h1.q},${h1.r}`);
    expect(keys).toContain(`${h2.q},${h2.r}`);

    const values = Array.from(grid.values());
    expect(values.length).toBe(2);
    expect(values).toContain(t1);
    expect(values).toContain(t2);

    const seen = new Set<HexTile>();
    grid.forEach((t) => seen.add(t));
    expect(seen.has(t1)).toBe(true);
    expect(seen.has(t2)).toBe(true);
  });
});
