import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Result } from '../enums/algorithm-result.enum';
import { Appstate } from '../enums/app-state.enum';
import { CurrentAppStateService } from '../services/current-app-state.service';
import { GridControlService } from '../services/grid-control.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private stateSubscription?: Subscription;
  private currentState?: Appstate;
  private algorithmResultSubscription?: Subscription;
  public stateMessage: string = '';
  public algorithmResult?: Result;

  constructor(public gridControlService: GridControlService) {}

  ngOnInit(): void {
    this.setStateMessage();
    this.stateSubscription = this.subscribeToAppState();
    this.algorithmResultSubscription = this.subscribeToAlgorithmResult();
  }

  public startAlgorithm() {
    if (this.currentState === Appstate.DrawingObstacles) {
      this.gridControlService.getDrawingEventTriggered().next(false);
      CurrentAppStateService.getStateSubject().next(
        CurrentAppStateService.getlastKnownStateBeforeDrawingObstacles()!
      );
      return;
    }
    if (!this.algorithmResult && this.algorithmResult !== 0) {
      this.gridControlService.triggerAlgorithm.emit();
    } else {
      CurrentAppStateService.resetAlgorithmEvent.emit();
    }
  }

  private subscribeToAlgorithmResult(): Subscription {
    return CurrentAppStateService.algorithmResultEvent.subscribe(
      (response: Result) => {
        if (response === Result.PathFound) {
          this.stateMessage = 'Optimal path has been found!';
          this.algorithmResult = Result.PathFound;
        } else if (response === Result.PathNotFound) {
          this.stateMessage =
            'No valid path has been found for this map (try again!)';
          this.algorithmResult = Result.PathNotFound;
        } else {
          this.setStateMessage();
          this.algorithmResult = undefined;
        }
      }
    );
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
      case Appstate.DrawingObstacles:
        this.stateMessage = 'Click and hold over the grid to draw obstacles!';
        break;
      default:
        this.stateMessage = '';
    }
  }

  public getCurrentState(): Appstate | undefined {
    return this.currentState;
  }

  public getButtonText(): string {
    if (this.currentState === Appstate.DrawingObstacles) return 'Finish';
    else if (this.algorithmResult === 0 || this.algorithmResult === 1) {
      return 'Reset';
    } else {
      return 'Start!';
    }
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
    this.algorithmResultSubscription?.unsubscribe();
  }
}
