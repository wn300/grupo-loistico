import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorsWorkCenterService {
  public collectionCoordinatorsWorkCenter = 'coordinatorsWorkCenter';

  constructor(private firestore: AngularFirestore) { }

  getCoordinatorsWorkCenters(): Observable<any> {
    return this.firestore.collection(this.collectionCoordinatorsWorkCenter).snapshotChanges();
  }

  postCoordinatorsWorkCenter(dataSave: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionCoordinatorsWorkCenter)
        .add(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  putCoordinatorsWorkCenter(id: string, dataSave: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionCoordinatorsWorkCenter)
        .doc(id)
        .set(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  deleteCoordinatorsWorkCenter(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionCoordinatorsWorkCenter)
        .doc(id)
        .delete()
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }
}
