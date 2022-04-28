import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Appstate } from '../enums/app-state.enum';
import { CurrentAppStateService } from '../services/current-app-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public stateMessage: string = '';
  private stateSubscription?: Subscription;
  private currentState?: Appstate;

  constructor() {}

  ngOnInit(): void {
    this.setStateMessage();
    this.stateSubscription = this.subscribeToAppState();
  }

  private subscribeToAppState(): Subscription {
    return CurrentAppStateService.getStateSubject().subscribe(
      (newState: Appstate) => {
        this.currentState = newState;
        this.setStateMessage(); // Update the state message to the new state
      }
    );
  }

  private setStateMessage(): void {
    switch (this.currentState) {
      case Appstate.SelectingStartPosition:
        this.stateMessage = 'Select the starting position!';
        break;
      case Appstate.SelectingEndPosition:
        this.stateMessage = 'Select the goal position!';
        break;
      case Appstate.AlgorithmRunning:
        this.stateMessage = '';
        break;
      case Appstate.AlgorithmFinished:
        this.stateMessage = 'The algorithm has finished!';
        break;
      default:
        this.stateMessage = '';
    }
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
  }
}
