import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GeoServiceService } from './geo-service.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { firestore } from 'firebase/app';
import { PostcodeService } from './postcode.service';

export interface User{
  username?: string;
  email: string;
  postcode: string;
  location?: firestore.GeoPoint;
}
@Injectable()
export class AuthenticationService {
  public user: Observable<User>;
  public userDetails: firebase.User = null;
  private itemDoc: AngularFirestoreDocument<User>;
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private post: PostcodeService) {
      this.user = this.afAuth.authState
      .switchMap(user =>{
        if(user){
          return this.db.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            // logged out, null
            return Observable.of(null)
          }
        });
    }
  getUserDetails(): firebase.User{
    return this.userDetails;
  }
  login(email: string, password: string) {
   this.afAuth.auth.signInWithEmailAndPassword(email,password)
   .catch(function (response){
    console.log("errorrrrr"+response);
   });
  }
  checkUsername(userName: string){
    return this.db.collection('users',ref => ref.where('username', '==', userName)).valueChanges();
  }
  signupWithEmail(email: string, password: string, data: User){
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        return this.setUserDoc(user, data) // create initial user document
      })
      .catch(error => console.log(error) );
  }
  private setUserDoc(user, userData: User) {
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);
    this.post.getPostCode(userData.postcode).subscribe(x => {
      let location =  new firestore.GeoPoint(x.result.latitude, x.result.longitude);
      const data: User = {
        username: userData.username,
        email: user.email,
        postcode: userData.postcode,
        location: location
      }
      return userRef.set(data)
    });
  }
 logout() {
   this.afAuth.auth.signOut();
 }
 signInWithTwitter() {
      return this.afAuth.auth.signInWithPopup(
        new firebase.auth.TwitterAuthProvider()
      )
    }
}
