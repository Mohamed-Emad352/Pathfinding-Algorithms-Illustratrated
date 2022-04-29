import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AStarAlgorithm } from '../grid/models/A-star-algorithm';
import { Node } from '../grid/models/node.model';

export const GRID_SIZE_SMALL = 16;
export const GRID_SIZE_MEDIUM = 32;
export const GRID_SIZE_LARGE = 64;

@Injectable({
  providedIn: 'root',
})
export class GridControlService {
  private gridSizeSubject = new BehaviorSubject<{ [key: string]: number }>({
    size: GRID_SIZE_SMALL,
    obstaclesNum: GRID_SIZE_SMALL ** 2 / 3,
  });
  private ready: boolean = false;
  private drawingEventTriggered = new Subject<boolean>();
  public triggerAlgorithm = new EventEmitter<any>();

  public getGridSizeSubject(): BehaviorSubject<{ [key: string]: number }> {
    return this.gridSizeSubject;
  }

  public getDrawingEventTriggered(): Subject<boolean> {
    return this.drawingEventTriggered;
  }

  public runAlgorithm(grid: Node[], positions: Node[]): Node[] | null {
    const algorithm = new AStarAlgorithm(grid);
    const startNode = positions[0];
    const endNode = positions[1];
    return algorithm.start(startNode, endNode);
  }

  public isReady(): boolean {
    return this.ready;
  }

  public setReady(val: boolean) {
    this.ready = val;
  }

  constructor() {}
}
