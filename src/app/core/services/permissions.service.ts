import { Injectable } from '@angular/core';
import { MODULE } from 'src/app/constants/app.constants';
import { User } from '../entity/user.entity';

import { UsersService } from './users.service';

export enum FUNCTIONS {
  read = 'read',
  add = 'add',
  update = 'update',
  delete = 'delete',
}

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  userData: User;

  constructor(private usersService: UsersService) {
    this.userData = this.usersService.getData();
  }

  public canActiveFunction(module: MODULE, _function: FUNCTIONS): boolean {
    const permissions = this.userData?.permissions[module];
    return permissions && permissions.indexOf(_function) >= 0;
  }
}
