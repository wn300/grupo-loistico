import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteFilesService {

  constructor(private firestore: AngularFirestore) { }

  getReportsByFiles(): Observable<any> {
    return this.firestore.collection('reports').snapshotChanges();
  }

  putReportsByFiles(id: string, dataSave: any): Promise<any> {
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
}
