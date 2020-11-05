import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Company } from '../entity/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  public collectionCompany = 'company';

  constructor(private firestore: AngularFirestore) { }

  getCompanies(): Observable<any> {
    return this.firestore.collection(this.collectionCompany).snapshotChanges();
  }

  postCompany(dataSave: Company): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionCompany)
        .add(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  putCompany(id: string, dataSave: Company): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionCompany)
        .doc(id)
        .set(dataSave)
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }

  deleteCompany(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collectionCompany)
        .doc(id)
        .delete()
        .then(
          res => resolve(res)
          , err => reject(err)
        );
    });
  }
}
