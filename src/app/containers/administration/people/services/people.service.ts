import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { People } from '../entity/people';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  public collectionPeople = 'people';

  constructor(private firestore: AngularFirestore, private firebaseAuth: AngularFireAuth) { }

  getPeople(): Observable<any> {
    return this.firestore.collection(this.collectionPeople).snapshotChanges();
  }

  getCordinators(): Observable<any> {
    return this.firestore.collection(this.collectionPeople,  ref => ref.where('position', '==', 'Coordinador')).snapshotChanges();
  }

  postUserAuth({email, password}): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.createUserWithEmailAndPassword(email, password.toString())
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
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
