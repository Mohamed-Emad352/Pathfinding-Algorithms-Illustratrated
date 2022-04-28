import { Component, OnInit } from '@angular/core';
import { NodePositionController } from './models/node-postion-controller.model';
import { Node } from './models/node.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  private grid: Node[] = [];
  private gridSize = 16;

  ngOnInit(): void {
    this.setupGrid();
  }

  public setupGrid(): void {
    this.grid = []; // Clear the grid
    for (let nodeId = 0; nodeId < this.gridSize ** 2; nodeId++) {
      this.grid.push(
        new Node(nodeId, [
          NodePositionController.getX(),
          this.gridSize - 1 - NodePositionController.getY(), // Flip the Y axis to match the grid
        ])
      );
      NodePositionController.incrementPosition();
    }
  }

  public getGrid(): Node[] {
    return this.grid;
  }

  public getNode(nodeId: number): Node {
    return this.grid[nodeId];
  }

  public printNode(e: any): void {
    console.log(e);
  }
}
