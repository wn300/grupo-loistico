import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { uniq } from 'lodash';
import { WorkCenter } from 'src/app/containers/administration/work-center/entity/work-center';
@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  public collectionReport = 'reports';
  public collectionPeople = 'people';
  public collectionCompany = 'company';

  constructor(private firestore: AngularFirestore) { }

  getReportsByFiles(): Observable<any> {
    return this.firestore.collection(this.collectionReport).snapshotChanges();
  }
  // getReportsByFilesByDates(startDate: Date, endDate: Date): Observable<any> {
  getReportsByFilesByDates(startDate: Date, endDate: Date): Observable<any> {
    return this.firestore.collection(this.collectionReport, (ref) =>
      ref.where('createAt', '<=', endDate).where('createAt', '>=', startDate).orderBy('createAt', 'asc'),
    ).valueChanges()
      .pipe(
        switchMap((reports: any) => {
          const usersIds = uniq(reports.map(p => p.createBy));

          if (usersIds.length > 0) {
            return combineLatest(
              of(reports),
              combineLatest(
                usersIds.map(usersId =>
                  this.firestore.collection(this.collectionPeople,
                    ref => ref.where('uid', '==', usersId)).valueChanges().pipe(
                      map(people => people[0] === undefined ? { undefined: true, uid: usersId } : people[0])
                    )
                )
              )
            );
          } else {
            return ['N'];
          }
        }),
        map(([reports, people]) => {
          if (people) {
            console.log('People not found  report apk', people.filter(peop => peop.undefined === true));
            return reports.map(report => {
              return {
                ...report,
                people: people.find((p: any) => p.uid === report.createBy)
              };
            });
          } else {
            return [];
          }
        })
      );
  }

  getCompany(): Observable<any> {
    return this.firestore.collection(this.collectionCompany).valueChanges();
  }
}
