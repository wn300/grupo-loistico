import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { New, NewPayload } from '../entity/new.entity';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  public collectionNews = 'news';

  constructor(private firestore: AngularFirestore) {}

  public getAll(): Observable<New[]> {
    return this.firestore
      .collection(this.collectionNews)
      .snapshotChanges()
      .pipe(
        map((data) =>
          data.map((item) => {
            const _data = item.payload.doc.data() as object;
            return {
              ..._data,
              id: item.payload.doc.id,
              dateStart: new Date(_data['dateStart'].seconds * 1000),
              dateEnd: new Date(_data['dateEnd'].seconds * 1000),
            } as New;
          })
        )
      );
  }

  public getAllByDates(startDate: Date, endDate: Date): Observable<New[]> {
    return this.firestore
      .collection(this.collectionNews, (ref) =>
        ref.where('dateStart', '<=', endDate).where('dateStart', '>=', startDate)
      )
      .snapshotChanges()
      .pipe(
        map((data) =>
          data.map((item) => {
            const _data = item.payload.doc.data() as object;
            return {
              ..._data,
              id: item.payload.doc.id,
              dateStart: new Date(_data['dateStart'].seconds * 1000),
              dateEnd: new Date(_data['dateEnd'].seconds * 1000),
            } as New;
          })
        )
      );
  }

  public create(data: NewPayload): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionNews)
        .add(data)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  public update(id: string, data: NewPayload): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionNews)
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
        .collection(this.collectionNews)
        .doc(id)
        .delete()
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }
}
