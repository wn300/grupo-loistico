import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { uniq } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ProgrmmingService {
  public collectionReport = 'reports';
  public collectionProgramming = 'programming';
  public collectionWorkCenter = 'workCenter';

  constructor(private firestore: AngularFirestore) { }

  getPrograming(startDate: Date, endDate: Date): Observable<any> {
    return this.firestore.collection(this.collectionProgramming, (ref) =>
      ref.where('date', '<=', endDate).where('date', '>=', startDate),
    )
      .valueChanges()
      .pipe(
        switchMap((programmings: any) => {
          const operationCodeIds = uniq(programmings.map(p => p.operationCode));
          return combineLatest(
            of(programmings),
            combineLatest(
              operationCodeIds.map(operationCodeId =>
                this.firestore.collection(this.collectionWorkCenter,
                  ref => ref.where('operationCode', '==', operationCodeId)).valueChanges().pipe(
                    map(workCenter => workCenter[0])
                  )
              )
            )
          );
        }),
        map(([programmings, workCenter]) => {
          return programmings.map(programming => {
            return {
              ...programming,
              workCenter: workCenter.find((wc: any) => wc.operationCode === programming.operationCode)
            };
          });
        })
      );
  }

  getReportsUsers(startDate: Date, endDate: Date): Observable<any> {
    return this.firestore.collection(this.collectionReport, (ref) =>
      ref.where('createAt', '<=', endDate).where('createAt', '>=', startDate),
    ).valueChanges();
  }
}
