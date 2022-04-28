export class NodePositionController {
  private static currentX = 0;
  private static currentY = 0;
  private static currentGridSize = 16;

  public static getX(): number {
    return this.currentX;
  }

  public static getY(): number {
    return this.currentY;
  }

  public static incrementPosition(): void {
    if (this.currentX < this.currentGridSize - 1) {
      this.currentX++;
    } else {
      this.currentX = 0;
      this.currentY++;
    }
  }

  public static resetPositions(): void {
    this.currentX = 0;
    this.currentY = 0;
  }

  public static setGridSize(gridSize: number): void {
    this.currentGridSize = gridSize;
  }
}
