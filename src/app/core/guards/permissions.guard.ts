import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root',
})
export class ModuleGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const userData = this.usersService.getData();
    if (!userData || !userData.permissions[route.data.modulePermission]) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
