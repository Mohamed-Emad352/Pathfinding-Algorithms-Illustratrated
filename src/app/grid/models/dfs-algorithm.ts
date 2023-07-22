import { GridHelper } from './grid-helper';
import { Node } from './node.model';

export class DfsAlgorithm {
  private graph: { [key: string]: Node[] } = {};
  private gridHelper: GridHelper;
  private visited: { [key: string]: boolean } = {};
  private parents: { [key: string]: Node } = {};
  private isPathFound = false;

  private searchedNodes: Node[] = [];

  constructor(private grid: Node[]) {
    this.gridHelper = new GridHelper(grid);
    this.constructGraph();
  }

  public start(startNode: Node, endNode: Node): any {
    let path: Node[] = [];
    this.exploreNeighbors(startNode, endNode);
    if (this.isPathFound) {
      path = this.constructPath(this.parents, startNode, endNode);
      return [path, this.searchedNodes];
    }
    return null;
  }

  private exploreNeighbors(node: Node, endNode: Node): void {
    if (this.isPathFound) {
      return;
    }
    if (node === endNode) {
      this.isPathFound = true;
      return;
    }
    this.visited[node!.getId()] = true;
    const neighbors = this.graph[node.getId()];
    neighbors.forEach((neighbor) => {
      if (!this.visited[neighbor.getId()]) {
        this.parents[neighbor.getId()] = node!;
        this.visited[neighbor.getId()] = true;
        if (
          !this.searchedNodes.find(
            (node: Node) => node.getId() === neighbor.getId()
          )
        ) {
          this.searchedNodes.push(neighbor);
        }
        this.exploreNeighbors(neighbor, endNode);
      }
    });
  }

  private constructGraph(): void {
    this.grid.forEach((node: Node) => {
      const neighbors: Node[] = this.gridHelper.getNeighbors(node);
      this.graph[node.getId()] = neighbors;
    });
  }

  private constructPath(
    nodeParents: { [key: number]: Node },
    startNode: Node,
    endNode: Node
  ): Node[] {
    // Get the path from the nodeParents object
    const path: Node[] = [];
    let currentNode = endNode;
    while (currentNode.getId() !== startNode.getId()) {
      path.push(currentNode);
      currentNode = nodeParents[currentNode.getId()];
    }
    return path.reverse();
  }
}
