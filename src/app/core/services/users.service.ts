import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { People } from 'src/app/containers/administration/people/entity/people';
import { USER_LOCAL_KEY, USER_ROL } from '../constants/user.constants';

import { User } from '../entity/user.entity';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public collectionUsers = 'people';
  public collectionPermissions = 'permission';

  constructor(
    private firestore: AngularFirestore,
    private readonly localStorage: LocalStorageService
  ) {}

  public get(id: string): Observable<User> {
    return this.firestore
      .collection(this.collectionUsers, (ref) => ref.where('uid', '==', id))
      .valueChanges()
      .pipe(
        switchMap((data) => {
          if (data && data.length > 0) {
            const _data = data[0] as People;
            const user = {
              id: id,
              name: `${_data.firstName} ${_data.secondName} ${_data.firstLastName} ${_data.secondLastName}`,
              rol: _data.position as USER_ROL,
            } as User;
            return this.firestore
              .collection(this.collectionPermissions)
              .doc(user.rol)
              .get()
              .pipe(
                map((permissions) => ({
                  ...user,
                  permissions: permissions.data(),
                }))
              );
          }
        })
      );
  }

  public getData(): User {
    return this.localStorage.get(USER_LOCAL_KEY) as User;
  }
}
