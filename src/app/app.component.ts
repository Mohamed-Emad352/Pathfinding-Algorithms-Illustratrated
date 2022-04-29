import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('overlay') overlay?: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Disabling tab because it's causing a bug with the control menu
    document.onkeydown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') e.preventDefault();
    };
  }

  isOverlayed = false;

  public toggleOverlay(): void {
    this.isOverlayed = !this.isOverlayed;
  }

  public removeOverlay(): void {
    this.renderer.addClass(this.overlay!.nativeElement, 'fadeout');
  }
}
