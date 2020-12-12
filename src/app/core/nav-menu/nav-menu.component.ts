import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { NavService } from '../services/nav/nav.service';
import { NavItem } from './entity/nav-meu';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class NavMenuComponent implements OnInit {
  public expanded: boolean;
  public styleMatListItem: string;
  public subscription: Subscription;

  // @HostBinding('attr.aria-expanded') ariaExpanded: boolean = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(public navService: NavService, public router: Router) {
    this.styleMatListItem = `padding-left:${this.depth * 12}px`;
  }

  ngOnInit(): void {
    this.subscription = this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        this.expanded = url.includes(this.item.route);
        // this.ariaExpanded = this.expanded;
      }
    });
  }

  onItemSelected(item: NavItem): void {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
      // if (this.mobileQuery.matches) {
      //   this.parent.sidenav.close();
      // }
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

  ngOnDestroy(): void {
    // this.mobileQuery.removeListener(this._mobileQueryListener);
    this.subscription.unsubscribe();
  }

}
