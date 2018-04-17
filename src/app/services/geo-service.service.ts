import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as GeoFire from "geofire";
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable, Subject } from 'rxjs';
import { firestore } from 'firebase/app'

interface SearchData {
  location: number[];
  radius: number;
}

@Injectable()
export class GeoService {

  dbRef: any;
  geoFire: any;

 constructor(private db: AngularFireDatabase) { }

  /// Queries database for nearby locations
  /// Maps results to the hits BehaviorSubject
  getLocation(itemID: string) {
  this.geoFire = new GeoFire(this.db.list('/items').query.ref);
  return this.geoFire.get(itemID);
  }
}
