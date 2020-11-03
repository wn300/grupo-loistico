import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd, Event } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public appDrawer: any;
  public currentUrl: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  public closeNav(): void {
    this.appDrawer.close();
  }

  public openNav(): void {
    this.appDrawer.open();
  }
}
