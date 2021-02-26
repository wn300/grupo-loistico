import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Programming } from '../entities/programming.entity';
import { uniq } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ProgrammingService {
  public collectionProgramming = 'programming';
  public collectionWorkCenter = 'workCenter';

  constructor(private firestore: AngularFirestore) {}

  getProgramming(): Observable<any> {
    return this.firestore
      .collection(this.collectionProgramming)
      .snapshotChanges()
      .pipe(
        switchMap((programmingsSnapShot: any) => {
          const programmings = programmingsSnapShot.map(resultProgrammings => {
            return {
              id: resultProgrammings.payload.doc.id,
              ...resultProgrammings.payload.doc.data(),
            };
          });

          const operationCodeIds = uniq(programmings.map(p => p.operationCode));

          if (operationCodeIds.length > 0) {
            return combineLatest(
              of(programmings),
              combineLatest(
                operationCodeIds.map(operationCodeId =>
                  this.firestore.collection(this.collectionWorkCenter,
                    ref => ref.where('operationCode', '==', operationCodeId)).valueChanges().pipe(
                      map(workCenter => workCenter[0])
                    )
                )
              ),
            );
          } else {
            return ['N'];
          }

        }),
        map(([programmings, workCenter]) => {
          if (workCenter) {
            return programmings.map(programming => {
              return {
                ...programming,
                workCenter: workCenter.find((wc: any) => wc.operationCode === programming.operationCode)
              };
            });
          } else {
            return [];
          }
        })
      );
  }

  getProgrammingByDates(from: Date, to: Date): Observable<any> {
    return this.firestore
      .collection(this.collectionProgramming, (ref) =>
        ref.where('date', '>=', from).where('date', '<', to)
      )
      .snapshotChanges();
  }

  postProgramming(dataSave: Programming[]): Promise<any> {
    const batch = this.firestore.firestore.batch();
    dataSave.forEach((item) => {
      const docRef = this.firestore.firestore
        .collection(this.collectionProgramming)
        .doc();
      batch.set(docRef, item);
    });
    return new Promise<any>((resolve, reject) => {
      batch.commit().then(
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  }

  putProgramming(id: string, data: Programming): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionProgramming)
        .doc(id)
        .set(data)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  deleteProgramming(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionProgramming)
        .doc(id)
        .delete()
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }
}
