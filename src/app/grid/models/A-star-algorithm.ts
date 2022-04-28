import { Node } from './node.model';
import { PriorityQueue } from './priority-queue.model';

const NODE_COST = 1;

export class AStarAlgorithm {
  private graph: { [key: string]: Node[] } = {};

  constructor(private grid: Node[]) {
    this.constructGraph();
  }

  public start(startNode: Node, endNode: Node): Node[] | null {
    const nodesToBeVisited = new PriorityQueue();
    const nodeParents: { [key: number]: number } = {};
    const nodeCosts: { [key: number]: number } = {};
    nodeCosts[startNode.getId()] = 0;

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
        return this.getPath(nodeParents, startNode, endNode);
      }

      const neighbors = this.getNeighbors(currentNode); // Get the neighbors of the current node
      neighbors.forEach((neighbor) => {
        const newCost = nodeCosts[currentNode.getId()] + NODE_COST;
        if (
          (!nodeCosts[neighbor.getId()] ||
            newCost < nodeCosts[neighbor.getId()]) &&
          !neighbor.isObstacle()
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
      currentNode = this.findNodeById(nodeParents[currentNode.getId()])!;
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
      const neighbors: Node[] = this.getNeighbors(node);
      this.graph[node.getId()] = neighbors;
    });
  }

  private getNeighbors(node: Node): Node[] {
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
    // Filter out undefined nodes
    const neighbors: Node[] = [];
    nodes.forEach((node: Node | undefined) => {
      if (node) {
        neighbors.push(node);
      }
    });
    return neighbors;
  }

  private findNodeByPosition(positions: number[]): Node | undefined {
    // Search for a node by its position
    return this.grid.find((node: Node) => {
      return node.getX() === positions[0] && node.getY() === positions[1];
    });
  }

  private findNodeById(id: number): Node | undefined {
    // Get for a node by its id
    return this.grid[id];
  }
}
