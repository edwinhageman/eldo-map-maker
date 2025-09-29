import { Hex } from "./coordinates.ts";

export class HexTile {
  public readonly hex: Hex;
  public readonly type: string;
  public readonly cost: number;

  constructor(hex: Hex, type: string, cost: number) {
    this.hex = hex;
    this.type = type;
    this.cost = cost;
  }
}
