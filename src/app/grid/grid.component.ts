import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Appstate } from '../enums/app-state.enum';
import { CurrentAppStateService } from '../services/current-app-state.service';
import { GridControlService } from '../services/grid-control.service';
import { AStarAlgorithm } from './models/A-star-algorithm';
import { NodePositionController } from './models/node-postion-controller.model';
import { Node } from './models/node.model';

const sleep = (milliseconds: number) => {
  // Sleep helper function
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnDestroy {
  private grid: Node[] = [];
  private gridSize!: number;
  private startNode?: Node;
  private endNode?: Node;
  private stateSubscription?: Subscription;
  private gridSizeSubscription?: Subscription;
  private currentState?: Appstate;

  constructor(private gridControlService: GridControlService) {}

  ngOnInit(): void {
    this.gridSizeSubscription = this.subscribeToGridSize();
    this.stateSubscription = this.subscribeToAppState(); // Subscribe to the app state
  }

  private setupGrid(): void {
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
    this.generateObstacles();
  }

  private generateObstacles(): void {
    // Generate some random obstacles
    for (let i = 0; i < this.gridSize ** 2 / 4; i++) {
      const randomNode =
        this.grid[Math.floor(Math.random() * this.grid.length)];
      if (randomNode.isObstacle()) {
        i--;
        continue;
      }
      randomNode.obstacle = true;
    }
  }

  private subscribeToAppState(): Subscription {
    return CurrentAppStateService.getStateSubject().subscribe(
      (newState: Appstate) => {
        this.currentState = newState;
      }
    );
  }

  private subscribeToGridSize(): Subscription {
    return this.gridControlService
      .getGridSizeSubject()
      .subscribe((newSize: number) => {
        this.gridSize = newSize;
        NodePositionController.gridSize = newSize;
        this.setupGrid();
      });
  }

  public getGrid(): Node[] {
    return this.grid;
  }

  public selectNode(node: Node): void {
    switch (this.currentState) {
      case Appstate.SelectingStartPosition:
        this.startNode = node;
        CurrentAppStateService.getStateSubject().next(
          Appstate.SelectingEndPosition
        ); // Update the app state to select the end position
        break;
      case Appstate.SelectingEndPosition:
        this.endNode = node;
        CurrentAppStateService.getStateSubject().next(
          Appstate.AlgorithmRunning
        ); // Update the app state to run the algorithm
        break;
      default: {
        const algorithm = new AStarAlgorithm(this.grid);
        const path = algorithm.start(this.startNode!, this.endNode!);
        this.displayPath(path!);
        break;
      }
    }
  }

  private async displayPath(path: Node[]) {
    for (let node of path) {
      this.grid[node.getId()].path = true;
      await sleep(100);
    }
  }

  public getStartNode(): Node {
    return this.startNode!;
  }

  public getEndNode(): Node {
    return this.endNode!;
  }

  public getGridSize(): number {
    return this.gridSize;
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
    this.gridSizeSubscription?.unsubscribe();
  }
}
