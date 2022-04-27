import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GridComponent } from './grid/grid.component';
import { ControlMenuComponent } from './control-menu/control-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GridComponent,
    ControlMenuComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
