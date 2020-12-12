import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { WorkCenter } from '../entity/work-center';

@Injectable({
  providedIn: 'root'
})
export class WorkCenterService {
  public collectionWorkCenter = 'workCenter';

  constructor(private firestore: AngularFirestore) { }

  getWorkCenters(): Observable<any> {
    return this.firestore.collection(this.collectionWorkCenter).snapshotChanges();
  }

  postWorkCenter(dataSave: WorkCenter): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionWorkCenter)
        .add(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  putWorkCenter(id: string, dataSave: WorkCenter): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionWorkCenter)
        .doc(id)
        .set(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  deleteWorkCenter(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionWorkCenter)
        .doc(id)
        .delete()
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }
}
