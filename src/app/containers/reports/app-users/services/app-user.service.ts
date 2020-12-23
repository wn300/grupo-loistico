import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  public collectionReport = 'reports';

  constructor(private firestore: AngularFirestore) { }

  getReportsByFiles(): Observable<any> {
    return this.firestore.collection(this.collectionReport).snapshotChanges();
  }
}
