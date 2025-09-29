export class Hex {
  public readonly q: number;
  public readonly r: number;
  public readonly s: number;

  constructor(q: number, r: number) {
    this.q = q;
    this.r = r;
    this.s = -q - r;
  }

  public add(hex: Hex) {
    return new Hex(this.q + hex.q, this.r + hex.r);
  }

  public sub(hex: Hex) {
    return new Hex(this.q - hex.q, this.r - hex.r);
  }

  public equals(hex: Hex) {
    return this.q === hex.q && this.r === hex.r;
  }
}

export class FractionHex {
  public readonly q: number;
  public readonly r: number;
  public readonly s: number;

  constructor(q: number, r: number, s: number) {
    this.q = q;
    this.r = r;
    this.s = s;
  }

  public round() {
    let q = Math.round(this.q);
    let r = Math.round(this.r);
    let s = Math.round(this.s);

    const qDiff = Math.abs(q - this.q);
    const rDiff = Math.abs(r - this.r);
    const sDiff = Math.abs(s - this.s);
    if (qDiff > rDiff && qDiff > sDiff) {
      q = -r - s;
    } else if (rDiff > sDiff) {
      r = -q - s;
    }
    return new Hex(q, r);
  }
}

export class Point {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(p: Point) {
    return new Point(this.x + p.x, this.y + p.y);
  }

  public sub(p: Point) {
    return new Point(this.x - p.x, this.y - p.y);
  }

  public scale(k: number) {
    return new Point(this.x * k, this.y * k);
  }
}
