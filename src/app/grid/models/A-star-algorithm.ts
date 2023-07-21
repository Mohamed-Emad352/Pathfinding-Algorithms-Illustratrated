import { GridHelper } from './grid-helper';
import { Node } from './node.model';
import { PriorityQueue } from './priority-queue.model';

const NODE_COST = 1;

export class AStarAlgorithm {
  private graph: { [key: string]: Node[] } = {};
  private gridHelper: GridHelper;

  constructor(private grid: Node[]) {
    this.gridHelper = new GridHelper(grid);
    this.constructGraph();
  }

  public start(startNode: Node, endNode: Node): any {
    const nodesToBeVisited = new PriorityQueue();
    const nodeParents: { [key: number]: number } = {};
    const nodeCosts: { [key: number]: number } = {};
    nodeCosts[startNode.getId()] = 0;
    const nodesSearched: Node[] = [];

    // Add the start node to the queue
    nodesToBeVisited.enqueue(
      startNode,
      this.getHeuristic(startNode, endNode) + nodeCosts[startNode.getId()] // f(n) = c(n) + h(n)
    );
    nodeParents[startNode.getId()] = -1; // The start node has no parent

    while (!nodesToBeVisited.isEmpty()) {
      const currentNode = nodesToBeVisited.dequeue();
      if (currentNode.getId() === endNode.getId()) {
        // We found the goal node
        return [this.getPath(nodeParents, startNode, endNode), nodesSearched];
      }
      const neighbors = this.gridHelper.getNeighbors(currentNode); // Get the neighbors of the current node
      neighbors.forEach(async (neighbor) => {
        // if neighbor is not in nodesSearched, push it to nodesSearched
        if (
          !nodesSearched.find((node: Node) => node.getId() === neighbor.getId())
        ) {
          nodesSearched.push(neighbor);
        }
        const newCost = nodeCosts[currentNode.getId()] + NODE_COST;
        if (
          !nodeCosts[neighbor.getId()] ||
          newCost < nodeCosts[neighbor.getId()]
        ) {
          // Update the cost of the neighbor
          nodeCosts[neighbor.getId()] = newCost;
          nodeParents[neighbor.getId()] = currentNode.getId();
          nodesToBeVisited.enqueue(
            neighbor,
            this.getHeuristic(neighbor, endNode) + nodeCosts[neighbor.getId()] // f(n) = c(n) + h(n)
          );
        }
      });
    }
    return null;
  }

  private getPath(
    nodeParents: { [key: number]: number },
    startNode: Node,
    endNode: Node
  ): Node[] {
    // Get the path from the nodeParents object
    const path: Node[] = [];
    let currentNode = endNode;
    while (currentNode.getId() !== startNode.getId()) {
      path.push(currentNode);
      currentNode = this.gridHelper.findNodeById(
        nodeParents[currentNode.getId()]
      )!;
    }
    return path.reverse();
  }

  private getHeuristic(node: Node, goalNode: Node): number {
    // Get the heuristic value of the node
    return (
      Math.abs(node.getX() - goalNode.getX()) +
      Math.abs(node.getY() - goalNode.getY())
    );
  }

  private constructGraph(): void {
    this.grid.forEach((node: Node) => {
      const neighbors: Node[] = this.gridHelper.getNeighbors(node);
      this.graph[node.getId()] = neighbors;
    });
  }
}
