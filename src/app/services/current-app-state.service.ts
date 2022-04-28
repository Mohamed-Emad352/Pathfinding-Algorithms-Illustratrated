import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Appstate } from '../enums/app-state.enum';

@Injectable({
  providedIn: 'root',
})
export class CurrentAppStateService {
  private static currentState = new BehaviorSubject<Appstate>(
    Appstate.SelectingStartPosition
  );

  constructor() {}

  public static getStateSubject(): BehaviorSubject<Appstate> {
    return this.currentState;
  }

  public static set state(newState: Appstate) {
    this.currentState.next(newState);
  }
}
