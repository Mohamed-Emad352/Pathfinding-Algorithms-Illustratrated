import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Appstate } from '../enums/app-state.enum';
import { CurrentAppStateService } from '../services/current-app-state.service';
import {
  GridControlService,
  GRID_SIZE_LARGE,
  GRID_SIZE_MEDIUM,
  GRID_SIZE_SMALL,
} from '../services/grid-control.service';
import { Algorithm } from '../enums/algorithm.enum';

@Component({
  selector: 'app-control-menu',
  templateUrl: './control-menu.component.html',
  styleUrls: ['./control-menu.component.scss'],
})
export class ControlMenuComponent implements OnInit, OnDestroy {
  private currentStateSubscription?: Subscription;
  private currentState?: Appstate;
  public isOpen = false;
  public selectedAlgorithm: Algorithm = Algorithm.aStar;
  @Output() public toggleMenu = new EventEmitter<void>();
  @Output() public removeOverlay = new EventEmitter<void>();
  @ViewChild('menu') menu?: ElementRef;
  @ViewChild('obstacles') obstaclesNum?: ElementRef;
  @ViewChild('sizeSmall') radioSmall?: ElementRef;
  @ViewChild('obstacles') obstaclesInput?: ElementRef;
  @ViewChild('sizeMedium') radioMedium?: ElementRef;
  @ViewChild('sizeLarge') radioLarge?: ElementRef;

  constructor(
    private renderer: Renderer2,
    private gridControlService: GridControlService
  ) {}

  ngOnInit(): void {
    this.currentStateSubscription = this.subscribeToAppState();
  }

  private getSelectedSize(): number {
    if (this.radioSmall?.nativeElement.classList.contains('selected')) {
      return GRID_SIZE_SMALL;
    } else if (this.radioMedium?.nativeElement.classList.contains('selected')) {
      return GRID_SIZE_MEDIUM;
    } else {
      return GRID_SIZE_LARGE;
    }
  }

  private subscribeToAppState(): Subscription {
    return CurrentAppStateService.getStateSubject().subscribe((state) => {
      this.currentState = state;
    });
  }

  public openMenu(): void {
    this.isOpen = true;
    this.toggleMenu.emit();
  }

  public closeMenu(): void {
    this.isOpen = false;
    this.renderer.addClass(this.menu!.nativeElement, 'closing');
    this.removeOverlay.emit();
    setTimeout(() => {
      this.renderer.removeClass(this.menu!.nativeElement, 'closing');
      this.toggleMenu.emit();
    }, 500);
  }

  public onGridSizeChange(val: string, el: any): void {
    this.renderer.removeClass(this.radioSmall?.nativeElement, 'selected');
    this.renderer.removeClass(this.radioLarge?.nativeElement, 'selected');
    this.renderer.removeClass(this.radioMedium?.nativeElement, 'selected');
    this.renderer.addClass(el, 'selected');
    this.obstaclesInput!.nativeElement.value = val;
  }

  public applySettings(): void {
    const size = this.getSelectedSize();
    console.log(this.selectedAlgorithm);
    this.gridControlService.selectedAlgorithm = this.selectedAlgorithm;
    this.gridControlService.getGridSizeSubject().next({
      size: size,
      obstaclesNum: this.obstaclesNum!.nativeElement.value,
    });
    this.gridControlService.getDrawingEventTriggered().next(false);
    // Disbale drawing incase of starting a new grid
    this.closeMenu();
  }

  public startDrawingObstacles(): void {
    CurrentAppStateService.lastKnowStateBeforeDrawingObstacles =
      this.currentState; // Save the current state
    this.gridControlService.getDrawingEventTriggered().next(true);
    this.closeMenu();
  }

  ngOnDestroy(): void {
    this.currentStateSubscription?.unsubscribe();
  }
}
