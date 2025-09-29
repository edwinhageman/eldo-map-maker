import { describe, expect, it } from "vitest";
import { FractionHex, Hex, Point } from "./coordinates.ts";

describe("Hex tests", () => {
  it("should calculate the s component", () => {
    const hex = new Hex(2, 6);
    expect(hex.s).toBe(-8);
  });

  it("add should return the sum", () => {
    const hex = new Hex(0, 0);
    const result = hex.add(new Hex(1, 2));
    expect(result.q).toBe(1);
    expect(result.r).toBe(2);
  });

  it("add should return a new hex", () => {
    const hex = new Hex(0, 0);
    const result = hex.add(new Hex(1, 2));
    expect(result).not.toBe(hex);
  });

  it("sub should return the differences", () => {
    const hex = new Hex(5, 5);
    const result = hex.sub(new Hex(1, 2));
    expect(result.q).toBe(4);
    expect(result.r).toBe(3);
  });

  it("sub should return a new hex", () => {
    const hex = new Hex(0, 0);
    const result = hex.sub(new Hex(1, 2));
    expect(result).not.toBe(hex);
  });

  it("equals should return true if the components are equal", () => {
    const h1 = new Hex(1, 2);
    const h2 = new Hex(1, 2);
    const result = h1.equals(h2);
    expect(result).toBe(true);
  });

  it("equals should return false if the components are not equal", () => {
    const h1 = new Hex(1, 2);
    const h2 = new Hex(1, 4);
    const result = h1.equals(h2);
    expect(result).toBe(false);
  });
});

describe("FactionalHex tests", () => {
  it("should round to nearest hex", () => {
    const frac = new FractionHex(2.3, 1.5, 4.1);
    const result = frac.round();
    expect(result.equals(new Hex(2, -6))).toBe(true);
  });

  it("round of none fractional values should return hex with identical components", () => {
    const frac = new FractionHex(2, 2, 2);
    const result = frac.round();
    expect(result.equals(new Hex(2, 2))).toBe(true);
  });
});

describe("Point tests", () => {
  it("add should return the sum", () => {
    const point = new Point(0, 0);
    const result = point.add(new Point(1, 2));
    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
  });

  it("add should return a new point", () => {
    const point = new Point(0, 0);
    const result = point.add(new Point(1, 2));
    expect(result).not.toBe(point);
  });

  it("sub should return the differences", () => {
    const point = new Point(5, 5);
    const result = point.sub(new Point(1, 2));
    expect(result.x).toBe(4);
    expect(result.y).toBe(3);
  });

  it("sub should return a new point", () => {
    const point = new Point(0, 0);
    const result = point.sub(new Point(1, 2));
    expect(result).not.toBe(point);
  });

  it("scale should return the product", () => {
    const point = new Point(3, 2);
    const result = point.scale(2);
    expect(result.x).toBe(6);
    expect(result.y).toBe(4);
  });

  it("scale should return a new point", () => {
    const point = new Point(3, 2);
    const result = point.scale(2);
    expect(result).not.toBe(point);
  });
});
