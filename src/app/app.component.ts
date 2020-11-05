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
        displayName: 'Inicio',
        iconName: 'dashboard',
        route: '/containers/home'
      },
      {
        displayName: 'Administración',
        iconName: 'supervisor_account',
        route: '/containers/administration',
        children: [
          {
            displayName: 'Empresas',
            iconName: '',
            route: '/containers/administration/company'
          },
          {
            displayName: 'Clientes',
            iconName: '',
            route: '/containers/administration/clients'
          },
          {
            displayName: 'Centros de trabajo',
            iconName: '',
            route: '/containers/administration/work_center'
          },
          {
            displayName: 'Personas',
            iconName: '',
            route: '/containers/administration/people'
          },
        ]
      }
    ];
  }

  emitActionClickToogle(): void {
    this.drawer.toggle();
  }
}
