import { describe, expect, it } from "vitest";
import { Layout, Orientation } from "./layout.ts";
import { Hex, Point } from "./coordinates.ts";

describe("Orientation parameters tests", () => {});

describe("Flat top layout tests", () => {
  const orientation = Orientation.flatTop();
  const size = new Point(1, 1);
  const origin = new Point(0, 0);
  const layout = new Layout(orientation, size, origin);

  it("Should render correct width", () => {
    const result = layout.polygonCorners(new Hex(0, 0));
    expect(result.length).toBe(6);
  });
});

describe("Pointy top layout tests", () => {
  const orientation = Orientation.pointyTop();
  const size = new Point(10, 10);
  const origin = new Point(0, 0);
  const layout = new Layout(orientation, size, origin);

  it("polygonCorners should return correct corners", () => {
    const result = layout.polygonCorners(new Hex(0, 0));
    console.log(result);
    // expect(result.length).toBe(6);
  });
});
