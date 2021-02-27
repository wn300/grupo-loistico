import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { combineLatest, Observable, of, pipe } from 'rxjs';
import { People } from '../entity/people';
import { JoinsFirebaseService } from 'src/app/shared/services/joins-firebase.service';
import { switchMap, map } from 'rxjs/operators';
import { uniq } from 'lodash';

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

  getOnlyPeopleSupernumeraria(): any {
    return this.firestore
      .collection(this.collectionPeople, ref => ref.where('position', '==', 'Supernumerario'))
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

  getOnlyPeopleSupernumerariaJoinCompany(): Observable<any> {
    return this.firestore
      .collection(this.collectionPeople, ref => ref.where('position', '==', 'Supernumerario'))
      .snapshotChanges()
      .pipe(
        switchMap((peopleSnapShot: any) => {
          const people = peopleSnapShot.map(resultPeople => {
            return {
              id: resultPeople.payload.doc.id,
              ...resultPeople.payload.doc.data(),
            };
          });

          const companyIds = uniq(people.map(p => p.company));

          if (companyIds.length > 0) {
            return combineLatest(
              of(people),
              combineLatest(
                companyIds.map(companyId =>
                  this.firestore.collection('company',
                    ref => ref.where('code', '==', companyId)).valueChanges().pipe(
                      map(company => company[0])
                    )
                )
              )
            );
          } else {
            return ['N'];
          }

        }),
        map(([people, company]) => {
          if (company) {
            return people.map(peopleResult => {
              return {
                ...peopleResult,
                company: company.find((wc: any) => wc.operationCode === peopleResult.operationCode)
              };
            });
          } else {
            return [];
          }
        })
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
