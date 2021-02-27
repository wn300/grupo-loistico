import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TypeNew, TypeNewPayload } from '../entity/type-new.entity';

@Injectable()
export class TypesNewsService {
  public collectionTypesNews = 'typesNews';

  constructor(private firestore: AngularFirestore) {}

  public getAll(): Observable<TypeNew[]> {
    return this.firestore
      .collection(this.collectionTypesNews)
      .snapshotChanges()
      .pipe(
        map((data) =>
          data.map((item) => {
            const _data = item.payload.doc.data() as object;
            return {
              ..._data,
              id: item.payload.doc.id,
            } as TypeNew;
          })
        )
      );
  }

  public getAllByDates(): Observable<TypeNew[]> {
    return this.firestore
      .collection(this.collectionTypesNews)
      .snapshotChanges()
      .pipe(
        map((data) =>
          data.map((item) => {
            const _data = item.payload.doc.data() as object;
            return {
              ..._data,
              id: item.payload.doc.id,
            } as TypeNew;
          })
        )
      );
  }

  public create(data: TypeNewPayload): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionTypesNews)
        .add(data)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  public update(id: string, data: TypeNewPayload): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionTypesNews)
        .doc(id)
        .set(data)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  public delete(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionTypesNews)
        .doc(id)
        .delete()
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }
}
