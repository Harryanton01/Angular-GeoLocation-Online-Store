import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { AngularFireDatabase} from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { firestore } from 'firebase/app'
import * as GeoFire from "geofire";
import { Upload } from '../uploads/upload'
import { UploadService } from '../uploads/upload.service'
import { AngularFireStorage } from 'angularfire2/storage';
import { AppComponent } from '../app.component'
import {AuthenticationService, User} from './authentication.service'
import { mergeMap, switchMap, scan } from 'rxjs/operators';


export interface item{
  desc: string;
  imageurl: string;
  title: string;
  userid: string;
  location: firestore.GeoPoint;
}

@Injectable()
export class ItemService {
  image: Observable<any>;
  usersCollection: AngularFirestoreCollection<User>;
  geoFire: GeoFire;
  dbRef:any;
  selectedFiles: FileList;
  currentUpload: Upload;
  private itemlistID = new Subject<string>();
  uploadedURL: string;
  private itemDoc: AngularFirestoreDocument<item>;
  public items: Observable<item[]>
  public item: Observable<item>
  private results =  new BehaviorSubject<item[]>([]);
  itemarray: item[];

  constructor(private geoDB: AngularFireDatabase, private db: AngularFirestore, private afStorage: AngularFireStorage, private authServ: AuthenticationService) {
   }
  
   public getItems(lat: number,long: number, radius: number): Observable<item[]>{
    this.geoFire = new GeoFire(this.geoDB.list('items').query.ref);
    this.geoFire.query({
      center: [lat, long],
      radius: radius
    }).on('key_entered', (key, location, distance)=>{
      this.itemlistID.next(key);
    });
    this.itemlistID.mergeMap(itemID => this.db.collection('items').doc<item>(itemID)
      .valueChanges())
      .scan((acc, curr) => [...acc, curr],[])
      .subscribe(x => this.results.next(x));
      return this.results;
   }

  getItem(itemID: string): any{
    return this.db.collection('items').doc<item>(itemID).valueChanges();
  }
  createItem(data: item){
      var key=this.db.createId();
      this.itemDoc = this.db.doc<item>('items/'+key);
      console.log(key);
      this.itemDoc.set(data);
  }
  createItemImage(data: item, file: File){
    let key=this.db.createId();
    this.itemDoc = this.db.doc<item>('items/'+key);
    console.log(key);
    let upload=this.afStorage.upload(key, file);
    upload.downloadURL().subscribe(url =>{
      data.imageurl=url;
      data.location = new firestore.GeoPoint(51.614208,-0.1275932);
      data.userid=this.authServ.getUserDetails().uid;
      //data.userid=appComp.userDetails.uid;
      this.itemDoc.set(data);
    });
  }
}
