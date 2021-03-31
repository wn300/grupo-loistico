import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { uniq } from 'lodash';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProgrmmingService {
  public collectionReport = 'reports';
  public collectionProgramming = 'programming';
  public collectionWorkCenter = 'workCenter';
  public collectionReportProgramming = 'reportProgramming';
  private user: Observable<any>;

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    this.user = this.afAuth.authState;
  }

  get currentUser(): Observable<any> {
    return this.user;
  }

  getOnlyPeopleByUID(uid: string): any {
    return this.firestore
      .collection('people', ref => ref.where('uid', '==', uid))
      .valueChanges();
  }

  getProgrammingJoinReport(startDate: Date, endDate: Date): Observable<any> {
    return this.firestore.collection(this.collectionReportProgramming, (ref) =>
      ref.where('date', '<=', endDate).where('date', '>=', startDate).orderBy('date', 'asc'),
    ).snapshotChanges()
      .pipe(
        switchMap((programmingsSnapShot: any) => {
          const programmings = programmingsSnapShot.map(resultPeople => {
            return {
              idProgrammingJoin: resultPeople.payload.doc.id,
              ...resultPeople.payload.doc.data(),
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

  getProgrammingJoinReportById(id: string): Observable<any> {
    return this.firestore.collection(this.collectionReportProgramming, (ref) =>
      ref.where('id', '==', id),
    ).snapshotChanges()
      .pipe(
        switchMap((programmingsSnapShot: any) => {
          const programmings = programmingsSnapShot.map(resultPeople => {
            return {
              idProgrammingJoin: resultPeople.payload.doc.id,
              ...resultPeople.payload.doc.data(),
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

  getOnlyPeopleJoinCompany(): any {
    const observable = this.firestore
      .collection('people')
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

  getPrograming(startDate: Date, endDate: Date): Observable<any> {
    return this.firestore.collection(this.collectionProgramming, (ref) =>
      ref.where('date', '<=', endDate).where('date', '>=', startDate).orderBy('date', 'asc'),
    )
      .snapshotChanges()
      .pipe(
        switchMap((programmingsSnapShot: any) => {
          const programmings = programmingsSnapShot.map(resultProgrammings => {
            return {
              programmingId: resultProgrammings.payload.doc.id,
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

  getReportsUsers(startDate: Date, endDate: Date): Observable<any> {
    return this.firestore.collection(this.collectionReport, (ref) =>
      ref.where('createAt', '<=', endDate).where('createAt', '>=', startDate),
    ).snapshotChanges();
  }

  getProgramingByIdProgramming(programmingUID: string): Observable<any> {
    return this.firestore.collection(this.collectionProgramming, (ref) =>
      ref.where('id', '==', programmingUID),
    ).valueChanges();

  }

  getReportsUsersByIdReport(reportUID: string): Observable<any> {
    return this.firestore.collection(this.collectionReport, (ref) =>
      ref.where('id', '==', reportUID),
    ).valueChanges();
  }

  postReports(dataSave: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('reports')
        .add(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  putReports(id: string, dataSave: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('reports')
        .doc(id)
        .set(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  postReportsProgramming(dataSave: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionReportProgramming)
        .add(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  putReportProgramming(id: string, dataSave: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionReportProgramming)
        .doc(id)
        .set(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

}
