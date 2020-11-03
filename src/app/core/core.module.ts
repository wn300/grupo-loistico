import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { MatMenuModule } from '@angular/material/menu';

import { NavService } from './services/nav/nav.service';
import { OptionsComponent } from './header/components/options/options.component';

@NgModule({
  declarations: [HeaderComponent, NavMenuComponent, OptionsComponent],
  exports: [HeaderComponent, NavMenuComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  providers: [
    NavService
  ]
})
export class CoreModule { }
