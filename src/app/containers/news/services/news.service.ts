import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { uniq } from 'lodash';

import { New, NewPayload } from '../entity/new.entity';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  public collectionNews = 'news';
  public collectionPeople = 'people';

  constructor(private firestore: AngularFirestore) { }

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
            const _data: any = item.payload.doc.data() as object;
            return {
              ..._data,
              id: item.payload.doc.id,
              people: {},
              dateStart: new Date(_data['dateStart'].seconds * 1000),
              dateEnd: new Date(_data['dateEnd'].seconds * 1000),
            } as New;
          })
        )
      );
  }

  getOnlyPeopleJoinCompany(): any {
    const observable = this.firestore
      .collection(this.collectionPeople)
      .snapshotChanges()
      .pipe(
        switchMap((peopleSnapShot: any) => {
          const people = peopleSnapShot.map(resultPeople => {
            return {
              id: resultPeople.payload.doc.id,
              ...resultPeople.payload.doc.data(),
            };
          });

          const companyIds = uniq(people.map(p => p.company));

          if (companyIds.length > 0) {
            return combineLatest(
              of(people),
              combineLatest(
                companyIds.map(companyId =>
                  this.firestore.collection('company',
                    ref => ref.where('code', '==', companyId)).valueChanges().pipe(
                      map(company => company[0])
                    )
                )
              )
            );
          } else {
            return ['N'];
          }

        }),
        map(([people, company]) => {
          if (company) {
            return people.map(peopleResult => {
              return {
                ...peopleResult,
                company: company.find((wc: any) => wc.operationCode === peopleResult.operationCode)
              };
            });
          } else {
            return [];
          }
        })
      );

    return observable;
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
