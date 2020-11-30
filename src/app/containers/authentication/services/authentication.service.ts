import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private user: Observable<any>;
  constructor(private afAuth: AngularFireAuth) {
    this.user = this.afAuth.authState;
  }

  // Obtener el estado de autenticación
  get authenticated(): boolean {
    return this.user != null; // True ó False
  }
  // Obtener el observador del usuario actual
  get currentUser(): Observable<any> {
    return this.user;
  }

  signUpWithEmail(email, pass): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, pass);
  }

  signInWithEmail(email, pass): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, pass)
  }

  logout(): Promise<any> {
    return this.afAuth.signOut();
  }

  resetPasswordInit(email: string): Promise<any> {
    return this.afAuth.sendPasswordResetEmail(
      email,
      { url: 'http://localhost:4200/auth' }
    );
  }
}
