import { FractionHex, Hex, Point } from "./coordinates.ts";

/**
 * Implementation reference for all the math and constants:
 * https://www.redblobgames.com/grids/hexagons/implementation.html#layout
 */
export class Orientation {
  public readonly f0;
  public readonly f1;
  public readonly f2;
  public readonly f3;
  public readonly b0;
  public readonly b1;
  public readonly b2;
  public readonly b3;
  public readonly startAngle;

  private constructor(
    f0: number,
    f1: number,
    f2: number,
    f3: number,
    b0: number,
    b1: number,
    b2: number,
    b3: number,
    startAngle: number,
  ) {
    this.f0 = f0;
    this.f1 = f1;
    this.f2 = f2;
    this.f3 = f3;
    this.b0 = b0;
    this.b1 = b1;
    this.b2 = b2;
    this.b3 = b3;
    this.startAngle = startAngle;
  }

  public static flatTop() {
    return new Orientation(
      3 / 2,
      0,
      Math.sqrt(3) / 2,
      Math.sqrt(3),
      2 / 3,
      0,
      -1 / 3,
      Math.sqrt(3) / 3,
      0,
    );
  }

  public static pointyTop() {
    return new Orientation(
      Math.sqrt(3),
      Math.sqrt(3) / 2,
      0,
      3 / 2,
      Math.sqrt(3) / 3,
      -1 / 3,
      0,
      2 / 3,
      Math.PI / 6,
    );
  }
}

/**
 * Implementation reference for all the math and constants:
 * https://www.redblobgames.com/grids/hexagons/implementation.html#layout
 */
export class Layout {
  private readonly orientation: Orientation;
  private readonly size: Point;
  private readonly origin: Point;

  constructor(orientation: Orientation, size: Point, origin: Point) {
    this.orientation = orientation;
    this.size = size;
    this.origin = origin;
  }

  public hexToPixel(hex: Hex) {
    let x =
      (this.orientation.f0 * hex.q + this.orientation.f1 * hex.r) * this.size.x;
    let y =
      (this.orientation.f2 * hex.q + this.orientation.f3 * hex.r) * this.size.y;
    return new Point(x + this.origin.x, y + this.origin.y);
  }

  public pixelToHex(point: Point) {
    const p = new Point(
      (point.x - this.origin.x) / this.size.x,
      (point.y - this.origin.y) / this.size.y,
    );
    const q = this.orientation.b0 * p.x + this.orientation.b1 * p.y;
    const r = this.orientation.b2 * p.x + this.orientation.b3 * p.y;
    return new FractionHex(q, r, -q - r);
  }

  public polygonCorners(hex: Hex) {
    const corners: Point[] = [];
    const center = this.hexToPixel(hex);
    for (let i = 0; i < 6; i++) {
      const angle = (2 * Math.PI * (this.orientation.startAngle + i)) / 6;
      const point = new Point(
        this.size.x * Math.cos(angle),
        this.size.y + Math.sin(angle),
      );
      corners.push(point.add(center));
    }
    return corners;
  }
}
