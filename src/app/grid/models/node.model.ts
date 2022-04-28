export class Node {
  private X;
  private Y;
  private obstacleNode: boolean;
  private pathNode: boolean;
  private isSearched: boolean = false;
  constructor(private id: number, position: number[]) {
    this.X = position[0];
    this.Y = position[1];
    this.obstacleNode = false;
    this.pathNode = false;
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

  public isObstacle(): boolean {
    return this.obstacleNode;
  }

  public isOnPath(): boolean {
    return this.pathNode;
  }

  public isBeingSearched(): boolean {
    return this.isSearched;
  }

  public set searched(val: boolean) {
    this.searched = val;
  }

  public set obstacle(val: boolean) {
    this.obstacleNode = val;
  }

  public set path(val: boolean) {
    this.pathNode = val;
  }
}
