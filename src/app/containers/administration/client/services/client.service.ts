import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Client } from '../entity/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  public collectionClient = 'client';

  constructor(private firestore: AngularFirestore) { }

  getClients(): Observable<any> {
    return this.firestore.collection(this.collectionClient).snapshotChanges();
  }

  postClient(dataSave: Client): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionClient)
        .add(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  putClient(id: string, dataSave: Client): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionClient)
        .doc(id)
        .set(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  deleteClient(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionClient)
        .doc(id)
        .delete()
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }
}
