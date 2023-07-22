import { GridHelper } from './grid-helper';
import { Node } from './node.model';

export class BfsAlgorithm {
  private graph: { [key: string]: Node[] } = {};
  private gridHelper: GridHelper;

  constructor(private grid: Node[]) {
    this.gridHelper = new GridHelper(grid);
    this.constructGraph();
  }

  public start(startNode: Node, endNode: Node): any {
    const visited: { [key: string]: boolean } = {};
    const parents: { [key: string]: Node } = {};
    const queue: Node[] = [];

    const searchedNodes: Node[] = [];
    let path: Node[] = [];
    queue.push(startNode);

    while (!(queue.length === 0)) {
      const node = queue.shift();
      if (node === endNode) {
        path = this.constructPath(parents, startNode, endNode);
        break;
      }
      visited[node!.getId()] = true;

      const neighbors = this.graph[node!.getId()];
      neighbors.forEach((neighbor) => {
        if (!visited[neighbor.getId()]) {
          parents[neighbor.getId()] = node!;
          queue.push(neighbor);
          visited[neighbor.getId()] = true;
          if (
            !searchedNodes.find(
              (node: Node) => node.getId() === neighbor.getId()
            )
          ) {
            searchedNodes.push(neighbor);
          }
        }
      });
    }

    if (path[path.length - 1] !== endNode) {
      return null;
    }
    return [path, searchedNodes];
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
