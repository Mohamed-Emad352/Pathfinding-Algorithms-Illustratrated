import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('overlay') overlay?: ElementRef;

  constructor(private renderer: Renderer2) {}

  isOverlayed = false;

  public toggleOverlay(): void {
    this.isOverlayed = !this.isOverlayed;
  }

  public removeOverlay(): void {
    this.renderer.addClass(this.overlay!.nativeElement, 'fadeout');
  }
}
