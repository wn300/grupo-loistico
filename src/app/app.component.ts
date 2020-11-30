import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { NavItem } from './core/nav-menu/entity/nav-meu';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { containersRootRoute } from './containers/containers-routing.module';
import { homeRootRoute } from './containers/home/home-routing.module';
import { AuthenticationService } from './containers/authentication/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public subscription: Subscription[];
  public isSmallScreen: boolean;
  public overOrSide: string;
  public menu: NavItem[];
  public isLogged: boolean;

  @ViewChild('drawer', { static: true }) drawer: MatDrawer;

  constructor(breakpointObserver: BreakpointObserver, private authenticationService: AuthenticationService, private router: Router) {
    this.subscription = [];
    this.isSmallScreen = breakpointObserver.isMatched('(max-width: 599px)');
    this.overOrSide = this.isSmallScreen ? 'over' : 'side';

    this.subscription.push(
      breakpointObserver.observe([
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait
      ]).subscribe(result => {
        this.isSmallScreen = result.matches;
        this.overOrSide = this.isSmallScreen ? 'over' : 'side';
      })
    );

    this.subscription.push(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((route: any) => {
        this.subscription.push(
          this.authenticationService.currentUser.subscribe(data => {
            if (data) {
              this.isLogged = true;
            } else {
              this.isLogged = false;
              const sideNav = document.getElementsByTagName('mat-sidenav')[0] as HTMLElement;

              if (sideNav.style.visibility === 'visible') {
                this.drawer.toggle();
              }
            }
          })
        );
      })
    );

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
            route: '/containers/administration/client'
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

  ngOnDestroy(): void {
    this.subscription.forEach(data => {
      data.unsubscribe();
    });
  }
}
