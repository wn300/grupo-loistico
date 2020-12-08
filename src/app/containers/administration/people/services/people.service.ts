import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { People } from '../entity/people';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  public collectionPeople = 'people';

  constructor(private firestore: AngularFirestore) { }

  getPeople(): Observable<any> {
    return this.firestore.collection(this.collectionPeople).snapshotChanges();
  }

  postPeople(dataSave: People): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionPeople)
        .add(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  putPeople(id: string, dataSave: People): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionPeople)
        .doc(id)
        .set(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  deletePeople(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionPeople)
        .doc(id)
        .delete()
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }
}
