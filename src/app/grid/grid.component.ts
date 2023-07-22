import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Result } from '../enums/algorithm-result.enum';
import { Appstate } from '../enums/app-state.enum';
import { CurrentAppStateService } from '../services/current-app-state.service';
import { GridControlService } from '../services/grid-control.service';
import { AStarAlgorithm } from './models/A-star-algorithm';
import { NodePositionController } from './models/node-postion-controller.model';
import { Node } from './models/node.model';
import { Algorithm } from '../enums/algorithm.enum';
import { BfsAlgorithm } from './models/bfs-algorithm';
import { DfsAlgorithm } from './models/dfs-algorithm';

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
  private algorithmTriggerSubscription?: Subscription;
  private resetAlgorithmSubscription?: Subscription;
  private drawObstaclesSubscription?: Subscription;
  private currentState?: Appstate;
  private lastObstaclesNum?: number; // Save the obstacles number for using again after resetting the grid
  public isDrawObstaclesMode: boolean = false;

  constructor(private gridControlService: GridControlService) {}

  ngOnInit(): void {
    this.gridSizeSubscription = this.subscribeToGridSize();
    this.stateSubscription = this.subscribeToAppState();
    this.algorithmTriggerSubscription = this.subscribeToAlgorithmEvent();
    this.resetAlgorithmSubscription = this.subscribeToResetAlgorithmEvent();
    this.drawObstaclesSubscription = this.subscribeToDrawingObstaclesSubject();
  }

  private setupGrid(obstacleNum: number): void {
    this.grid = []; // Clear the grid
    NodePositionController.gridSize = this.gridSize; // Set the grid size
    for (let nodeId = 0; nodeId < this.gridSize ** 2; nodeId++) {
      this.grid.push(
        new Node(nodeId, [
          NodePositionController.getX(),
          this.gridSize - 1 - NodePositionController.getY(), // Flip the Y axis to match the grid
        ])
      );
      NodePositionController.incrementPosition();
    }
    this.generateObstacles(obstacleNum);
  }

  private generateObstacles(
    obstaclesNum: number = this.gridSize ** 2 / 3
  ): void {
    // Generate some random obstacles
    const obstaclesIndices: number[] = [];
    while (obstaclesIndices.length < obstaclesNum) {
      const randomNode =
        this.grid[Math.floor(Math.random() * this.grid.length)];
      if (obstaclesIndices.indexOf(randomNode.getId()) === -1) {
        // ID === Index
        obstaclesIndices.push(randomNode.getId());
      }
    }
    obstaclesIndices.forEach((obstacleId: number) => {
      this.grid[obstacleId].obstacle = true;
    });
  }

  private sendResponseToHeader(path: Node[] | null) {
    if (path) {
      CurrentAppStateService.algorithmResultEvent.next(Result.PathFound);
    } else {
      CurrentAppStateService.algorithmResultEvent.next(Result.PathNotFound);
    }
  }

  private subscribeToDrawingObstaclesSubject(): Subscription {
    return this.gridControlService
      .getDrawingEventTriggered()
      .subscribe((val: boolean) => {
        this.isDrawObstaclesMode = val;
        if (val) {
          CurrentAppStateService.getStateSubject().next(
            Appstate.DrawingObstacles
          );
        }
      });
  }

  private subscribeToAppState(): Subscription {
    return CurrentAppStateService.getStateSubject().subscribe(
      (newState: Appstate) => {
        this.currentState = newState;
      }
    );
  }

  private subscribeToResetAlgorithmEvent(): Subscription {
    return CurrentAppStateService.resetAlgorithmEvent.subscribe(() => {
      this.resetAlgorithm();
    });
  }

  private subscribeToAlgorithmEvent(): Subscription {
    return this.gridControlService.triggerAlgorithm.subscribe(() => {
      const selectedAlgorithm = this.gridControlService.selectedAlgorithm;
      let path, nodesSearched;
      let algorithm;
      if (selectedAlgorithm === Algorithm.aStar) {
        algorithm = new AStarAlgorithm(this.grid);
        [path, nodesSearched] = algorithm.start(
          this.startNode!,
          this.endNode!
        ) || [null, null];
      } else if (selectedAlgorithm === Algorithm.bfs) {
        algorithm = new BfsAlgorithm(this.grid);
        [path, nodesSearched] = algorithm.start(
          this.startNode!,
          this.endNode!
        ) || [null, null];
      } else if (selectedAlgorithm === Algorithm.dfs) {
        algorithm = new DfsAlgorithm(this.grid);
        [path, nodesSearched] = algorithm.start(
          this.startNode!,
          this.endNode!
        ) || [null, null];
      }
      this.sendResponseToHeader(path);
      this.displayAllNodes(nodesSearched, path);
    });
  }

  private subscribeToGridSize(): Subscription {
    return this.gridControlService
      .getGridSizeSubject()
      .subscribe((sizesObject: { [key: string]: number }) => {
        // sizesObject is an object with the keys 'size' and 'obstaclesNum'
        this.gridSize = sizesObject['size'];
        NodePositionController.gridSize = sizesObject['size'];
        if (sizesObject['obstaclesNum'] > sizesObject['size'] ** 2) {
          sizesObject['obstaclesNum'] = sizesObject['size'] ** 2;
        }
        this.setupGrid(sizesObject['obstaclesNum']);
        this.lastObstaclesNum = sizesObject['obstaclesNum'];
        CurrentAppStateService.getStateSubject().next(
          Appstate.SelectingStartPosition
        );
        // Reset the algorithm state to stop animation in between grid change
        this.gridControlService.setReady(false);
        CurrentAppStateService.algorithmResultEvent.next(null);
      });
  }

  public getGrid(): Node[] {
    return this.grid;
  }

  public selectNode(node: Node): void {
    if (this.isDrawObstaclesMode) {
      // If the user is drawing obstacles, don't select a node
      return;
    }
    switch (this.currentState) {
      case Appstate.SelectingStartPosition:
        if (node.isObstacle()) {
          return;
        }
        this.startNode = node;
        CurrentAppStateService.getStateSubject().next(
          Appstate.SelectingEndPosition
        ); // Update the app state to select the end position
        break;
      case Appstate.SelectingEndPosition:
        if (node.isObstacle() || node.getId() === this.startNode?.getId()) {
          return;
        }
        this.endNode = node;
        CurrentAppStateService.getStateSubject().next(
          Appstate.AlgorithmRunning
        ); // Update the app state to run the algorithm
        this.gridControlService.setReady(true);
        break;
      default: {
        break;
      }
    }
  }

  private resetAlgorithm() {
    // if there were no specific obastacles number set before, use the standard one
    // otherwise, use the last one
    this.setupGrid(
      this.lastObstaclesNum ? this.lastObstaclesNum : this.gridSize ** 2 / 3
    );
    CurrentAppStateService.getStateSubject().next(
      Appstate.SelectingStartPosition
    );
    this.gridControlService.setReady(false);
    CurrentAppStateService.algorithmResultEvent.next(null);
  }

  private async displayAllNodes(nodesSearched: Node[], path: Node[]) {
    // Display searched nodes & path nodes
    if (nodesSearched) {
      await this.displaySearchedNodes(nodesSearched);
    }
    if (path) {
      await this.displayPath(path);
    }
  }

  private async displayPath(path: Node[]) {
    for (let node of path) {
      if (this.currentState === Appstate.SelectingStartPosition) {
        return; // If the algorithm is reset, stop displaying the path
      }
      this.grid[node.getId()].path = true;
      await sleep(100); // just to make the animation look better
    }
  }

  private async displaySearchedNodes(nodes: Node[]) {
    for (let node of nodes) {
      if (this.currentState === Appstate.SelectingStartPosition) {
        return; // If the algorithm is reset, stop displaying the searched nodes
      }
      this.grid[node.getId()].searched = true;
      await sleep(0); // just to make the animation look better
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

  public drawObstacle(event: MouseEvent, node: Node): void {
    if (
      !this.isDrawObstaclesMode ||
      node.getId() === this.startNode?.getId() ||
      node.getId() === this.endNode?.getId()
    ) {
      return;
    }
    if (event.buttons === 1) this.grid[node.getId()].obstacle = true;
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
    this.gridSizeSubscription?.unsubscribe();
    this.algorithmTriggerSubscription?.unsubscribe();
    this.resetAlgorithmSubscription?.unsubscribe();
    this.drawObstaclesSubscription?.unsubscribe();
  }
}
