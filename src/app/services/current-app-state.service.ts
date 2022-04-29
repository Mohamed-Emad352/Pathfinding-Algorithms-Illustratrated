import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Result } from '../enums/algorithm-result.enum';
import { Appstate } from '../enums/app-state.enum';

@Injectable({
  providedIn: 'root',
})
export class CurrentAppStateService {
  public static algorithmResultEvent = new EventEmitter<Result | null>();
  public static resetAlgorithmEvent = new EventEmitter<void>();
  private static lastKnownStateBeforeDrawingObstacles?: Appstate | undefined;
  private static currentState = new BehaviorSubject<Appstate>(
    Appstate.SelectingStartPosition
  );

  constructor() {}

  public static getStateSubject(): BehaviorSubject<Appstate> {
    return this.currentState;
  }

  public static getlastKnownStateBeforeDrawingObstacles():
    | Appstate
    | undefined {
    return this.lastKnownStateBeforeDrawingObstacles;
  }

  public static set lastKnowStateBeforeDrawingObstacles(
    state: Appstate | undefined
  ) {
    this.lastKnownStateBeforeDrawingObstacles = state;
  }
}
