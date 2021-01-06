import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Programming } from '../entities/programming.entity';

@Injectable({
  providedIn: 'root',
})
export class ProgrammingService {
  public collectionProgramming = 'programming';

  constructor(private firestore: AngularFirestore) {}

  getProgramming(): Observable<any> {
    return this.firestore
      .collection(this.collectionProgramming)
      .snapshotChanges();
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
}
