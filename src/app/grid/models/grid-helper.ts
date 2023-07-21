import { Node } from './node.model';

export class GridHelper {
  constructor(private grid: Node[]) {}

  public getNeighbors(node: Node): Node[] {
    // Get the neighbors of the node
    const downNode: Node | undefined = this.findNodeByPosition([
      node.getX(),
      node.getY() - 1,
    ]);
    const upNode: Node | undefined = this.findNodeByPosition([
      node.getX(),
      node.getY() + 1,
    ]);
    const leftNode: Node | undefined = this.findNodeByPosition([
      node.getX() - 1,
      node.getY(),
    ]);
    const rightNode: Node | undefined = this.findNodeByPosition([
      node.getX() + 1,
      node.getY(),
    ]);
    return this.filterNeighbors([downNode, upNode, leftNode, rightNode]);
  }

  private filterNeighbors(nodes: (Node | undefined)[]): Node[] {
    // Filter out undefined nodes / obstacle nodes
    const neighbors: Node[] = [];
    nodes.forEach((node: Node | undefined) => {
      if (node && !node.isObstacle()) {
        neighbors.push(node);
      }
    });
    return neighbors;
  }

  public findNodeByPosition(positions: number[]): Node | undefined {
    // Search for a node by its position
    return this.grid.find((node: Node) => {
      return node.getX() === positions[0] && node.getY() === positions[1];
    });
  }

  public findNodeById(id: number): Node | undefined {
    // Get for a node by its id
    return this.grid[id];
  }
}
