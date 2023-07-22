import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Algorithm } from '../enums/algorithm.enum';

export const GRID_SIZE_SMALL = 16;
export const GRID_SIZE_MEDIUM = 32;
export const GRID_SIZE_LARGE = 64;

@Injectable({
  providedIn: 'root',
})
export class GridControlService {
  private gridSizeSubject = new BehaviorSubject<{ [key: string]: number }>({
    size: GRID_SIZE_MEDIUM,
    obstaclesNum: GRID_SIZE_MEDIUM ** 2 / 3,
  });
  private ready: boolean = false;
  private drawingEventTriggered = new Subject<boolean>();
  public triggerAlgorithm = new EventEmitter<any>();
  public selectedAlgorithm: Algorithm = Algorithm.aStar;

  public getGridSizeSubject(): BehaviorSubject<{ [key: string]: any }> {
    return this.gridSizeSubject;
  }

  public getDrawingEventTriggered(): Subject<boolean> {
    return this.drawingEventTriggered;
  }

  public isReady(): boolean {
    return this.ready;
  }

  public setReady(val: boolean) {
    this.ready = val;
  }

  constructor() {}
}
