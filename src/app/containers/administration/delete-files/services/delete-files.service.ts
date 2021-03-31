import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { uniq } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DeleteFilesService {
  public collectionReport = 'reports';
  public collectionPeople = 'people';

  constructor(private firestore: AngularFirestore) { }

  getReportsByFiles(): Observable<any> {
    return this.firestore.collection(this.collectionReport).snapshotChanges();
  }
  getReportsByFilesJoinPeople(startDate: Date, endDate: Date): Observable<any> {
    return this.firestore.collection(this.collectionReport, (ref) =>
      ref.where('createAt', '<=', endDate).where('createAt', '>=', startDate).orderBy('createAt', 'asc'),
    )
      .snapshotChanges()
      .pipe(
        switchMap((reportSnapShot: any) => {
          const report = reportSnapShot.map(resultreport => {
            return {
              id: resultreport.payload.doc.id,
              ...resultreport.payload.doc.data(),
            };
          });

          const reportsCreateIds = uniq(report.map(p => p.createBy));

          if (reportsCreateIds.length > 0) {
            return combineLatest(
              of(report),
              combineLatest(
                reportsCreateIds.map(reportCreateId =>
                  this.firestore.collection('people',
                    ref => ref.where('uid', '==', reportCreateId)).valueChanges().pipe(
                      map(people => people[0] === undefined ? { undefined: true, uid: reportCreateId } : people[0])
                    )
                )
              )
            );
          } else {
            return ['N'];
          }

        }),
        map(([report, people]) => {
          if (report) {
            return report.map(reportResult => {
              return {
                ...reportResult,
                people: people.find((p: any) => p.uid === reportResult.createBy)
              };
            });
          } else {
            return [];
          }
        })
      );
  }

  getPeople(): Observable<any> {
    return this.firestore
      .collection(this.collectionPeople)
      .valueChanges();
  }

  putReportsByFiles(id: string, dataSave: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionReport)
        .doc(id)
        .set(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }
}
