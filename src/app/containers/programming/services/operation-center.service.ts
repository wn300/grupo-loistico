import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable()
export class OperationCenterService {
  public collectionOperationCenters = 'operationCenter';

  constructor(private firestore: AngularFirestore) {}

  getOperations(): Observable<any> {
    return this.firestore
      .collection(this.collectionOperationCenters)
      .snapshotChanges();
  }
}
