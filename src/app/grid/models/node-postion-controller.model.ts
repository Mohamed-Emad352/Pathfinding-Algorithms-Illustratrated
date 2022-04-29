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
      this.currentY++; // If we've reached the end of the row, increment the Y position
    }
  }

  public static resetPositions(): void {
    this.currentX = 0;
    this.currentY = 0;
  }

  public static set gridSize(gridSize: number) {
    this.currentGridSize = gridSize;
    this.resetPositions(); // Reset the positions when the grid size changes
  }

  public static get gridSize(): number {
    return this.currentGridSize;
  }
}
