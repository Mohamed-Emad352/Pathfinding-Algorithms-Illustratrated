import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AStarAlgorithm } from '../grid/models/A-star-algorithm';
import { Node } from '../grid/models/node.model';

const GRID_SIZE_SMALL = 16;
const GRID_SIZE_MEDIUM = 32;
const GRID_SIZE_LARGE = 64;

@Injectable({
  providedIn: 'root',
})
export class GridControlService {
  private gridSizeSubject = new BehaviorSubject<number>(GRID_SIZE_MEDIUM);
  private ready: boolean = false;
  public triggerAlgorithm = new EventEmitter<any>();

  public getGridSizeSubject(): BehaviorSubject<number> {
    return this.gridSizeSubject;
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
