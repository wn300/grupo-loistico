import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavItem } from './core/nav-menu/entity/nav-meu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isSmallScreen: boolean;
  public overOrSide: string;
  public menu: NavItem[];

  @ViewChild('drawer', { static: true }) drawer: MatDrawer;

  constructor(breakpointObserver: BreakpointObserver) {
    this.isSmallScreen = breakpointObserver.isMatched('(max-width: 599px)');
    this.overOrSide = this.isSmallScreen ? 'over' : 'side';
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.isSmallScreen = result.matches;
      this.overOrSide = this.isSmallScreen ? 'over' : 'side';
    });


    this.menu = [
      {
        displayName: 'Ejemplo 1',
        iconName: 'dashboard',
        route: '/containers/home'
      },
      {
        displayName: 'Ejemplo 2',
        iconName: 'supervisor_account',
        route: '/containers',
        children: [
          {
            displayName: 'Ejemplo 2.1',
            iconName: '',
            route: '/containers/example_one'
          }
        ]
      }
    ];
  }

  emitActionClickToogle(): void {
    this.drawer.toggle();
  }
}
