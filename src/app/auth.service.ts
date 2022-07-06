import { Injectable, NgZone } from '@angular/core';
import { User } from './models/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { doc, setDoc, Timestamp } from "firebase/firestore";


import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['/token']);
        });
        this.SetUserData(result.user);
        console.log('logado com sucesso', result.user)
      })
      .catch((error) => {
        window.alert('Usuário ou senha não conferem');
        // window.alert(error.message);
      });
  }
  // Sign up with email/password
  SignUp(name: string, email: string, phone: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */

        this.router.navigate(['/token']);
        this.SetUserData(result.user);
      })


      .catch((error) => {
        window.alert(error.message);
      });
  }
  // S
  // sendUserDatabase() {
  //   return this.afAuth.currentUser
  //     .then((u: any) => u.sendEmailVerification())
  //     .then(() => {
  //       this.router.navigate(['verify-email-address']);
  //     });
  // }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      if (res) {
        this.router.navigate(['dashboard']);
      }
    });
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    console.log('SetUserData user => ', user);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    console.log('SetUserData userRef => ', userRef);

    const userData: User = {
      uid: user.uid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      // code: this.generateCode(),
      // code: String(this.generateCode()).toUpperCase(),
      // timestamp: new Date().getTime(),
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // generateCode(): any {
  //   // I generate the UID from two parts here
  //   // to ensure the random number provide enough bits.
  //   var firstPart = (Math.random() * 46656) | 0;
  //   var secondPart = (Math.random() * 46656) | 0;
  //   // firstPart = ('000' + firstPart.toString(36)).slice(-3);
  //   // secondPart = ('000' + secondPart.toString(36)).slice(-3);
  //   return firstPart + secondPart;
  // };


  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/dashboard']);
    });
  }
}