import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { MODULE } from 'src/app/constants/app.constants';

import { UsersService } from 'src/app/core/services/users.service';

@Injectable({
  providedIn: 'root',
})
export class ManagementGuard implements CanActivate {
  constructor(private usersService: UsersService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const userData = this.usersService.getData();
    if (
      !userData ||
      !userData.permissions[MODULE.management][route.data.modulePermission]
    ) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
