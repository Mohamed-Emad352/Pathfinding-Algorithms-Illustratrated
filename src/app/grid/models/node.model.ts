export class Node {
  private X;
  private Y;
  constructor(private id: number, position: number[]) {
    this.X = position[0];
    this.Y = position[1];
  }

  public getX(): number {
    return this.X;
  }

  public getY(): number {
    return this.Y;
  }

  public getId(): number {
    return this.id;
  }
}
