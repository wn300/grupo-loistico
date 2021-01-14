import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, pipe } from 'rxjs';
import { People } from '../entity/people';
import { JoinsFirebaseService } from 'src/app/shared/services/joins-firebase.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  public collectionPeople = 'people';

  constructor(
    private firestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth,
    private JoinsFirebaseService: JoinsFirebaseService) { }

  getPeople(): Observable<any> {
    return this.firestore
      .collection(this.collectionPeople)
      .snapshotChanges();
  }

  getPeopleJoinCompany(): any {
    return this.firestore
      .collection(this.collectionPeople)
      .valueChanges()
      .pipe(
        this.JoinsFirebaseService.innerJoin(this.firestore, 'company', 'company'),
      );
  }

  getCordinators(): Observable<any> {
    return this.firestore.collection(this.collectionPeople, ref => ref.where('position', '==', 'Coordinador')).snapshotChanges();
  }

  postUserAuth({ email, password }): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.createUserWithEmailAndPassword( email, password.toString() )
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  postUserAuthMasiv({ email, password }): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.createUserWithEmailAndPassword(email, password.toString())
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  postPeople(dataSave: People, uid: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      dataSave.uid = uid;
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
