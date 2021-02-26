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
