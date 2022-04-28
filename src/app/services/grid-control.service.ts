import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GridControlService {
  private gridSizeSubject = new BehaviorSubject<number>(64);

  public getGridSizeSubject(): BehaviorSubject<number> {
    return this.gridSizeSubject;
  }

  constructor() {}
}
