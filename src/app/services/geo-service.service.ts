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
export class GeoServiceService {

  dbRef: any;
  geoFire: any;

  hits = new BehaviorSubject([])

 constructor(private db: AngularFireDatabase) { }

  setUserLocation(key:string, coords: Array<number>) {
    this.geoFire = new GeoFire(this.db.list('/users/'+key).query.ref);
    this.geoFire.set("loc", coords)
        .then(_ => console.log('location updated'))
        .catch(err => console.log(err))
  }

  /// Adds GeoFire data to database
  setLocation(key:string, coords: Array<number>) {
    this.geoFire = new GeoFire(this.db.list('/location').query.ref);
    this.geoFire.set(key, coords)
        .then(_ => console.log('location updated'))
        .catch(err => console.log(err))
  }


  /// Queries database for nearby locations
  /// Maps results to the hits BehaviorSubject
  getLocations(radius: number, coords: Array<number>) {
  this.geoFire = new GeoFire(this.db.list('/location').query.ref);
  this.geoFire.query({
     center: coords,
     radius: radius
   })
   .on('key_entered', (key, location, distance) => {
     console.log("r"+radius+" "+coords+" "+distance);
     let hit = {
       location: location,
       distance: distance
     }

     let currentHits = this.hits.value
     currentHits.push(hit)
     this.hits.next(currentHits)
   });
  }
}
