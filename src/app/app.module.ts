import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GridComponent } from './grid/grid.component';
import { ControlMenuComponent } from './control-menu/control-menu.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GridComponent,
    ControlMenuComponent,
  ],
  imports: [BrowserModule, NgSelectModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
