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
import { distinctUntilChanged } from 'rxjs/operators';
import { MessagingService } from './messaging.service';
import { AngularFireAuth } from 'angularfire2/auth';


export interface Item{
  itemID: string;
  description: string;
  imageURL: string;
  title: string;
  userID: string;
  username: string;
  location: firestore.GeoPoint;
  enablelocation: boolean;
  timestamp: string;
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
  private itemDoc: AngularFirestoreDocument<Item>;
  public items: Observable<Item[]>
  public item: Observable<Item>
  private results =  new Subject<Item[]>(); 
  username: string | null;
  itemarray: Item[];

  constructor(private geoDB: AngularFireDatabase, private db: AngularFirestore, private afStorage: AngularFireStorage, private authServ: AuthenticationService,
  private message: MessagingService, private auth: AngularFireAuth) {
    this.auth.authState.subscribe(auth => {
      if(auth !== undefined && auth !==null){
        this.db.doc<User>('users/'+auth.uid).valueChanges()
        .subscribe(x =>{
        this.username=x.username;
      })
    }
  });
   }
  ngOnDestroy(){
    this.results.unsubscribe();
    this.itemlistID.unsubscribe();
    this.geoFire.unsubscribe();
  }
   public getItems(lat: number,long: number, radius: number): Observable<Item[]>{
    let queryRef= this.geoDB.list('/items');

    this.geoFire = new GeoFire(queryRef.query.ref);
    setTimeout(() => {this.geoFire.query({
      center: [lat, long],
      radius: radius
    }).on('key_entered', (key, location, distance)=>{
      console.log(key)
      this.itemlistID.next(key);
    });}, 1000);
  
    this.itemlistID.mergeMap(itemID => this.db.collection('items').doc<Item>(itemID)
      .valueChanges())
      .scan((acc, curr) => [...acc, curr],[])
      .delay(500)
      .subscribe(x =>{
        this.results.next(x);
        console.log(x);
      });
      return this.results;
   }
  
  getItem(itemID: string): any{
    return this.db.collection('items').doc<Item>(itemID).valueChanges();
  }
  createItem(data: Item){
      var key=this.db.createId();
      this.itemDoc = this.db.doc<Item>('items/'+key);
      console.log(key);
      this.itemDoc.set(data);
  }
  createItemwithImage(data: Item, file: File){
    let key=this.db.createId();
    this.itemDoc = this.db.doc<Item>('items/'+key);
    let upload=this.afStorage.upload(key, file);
    upload.downloadURL().subscribe(url =>{
      data.imageURL=url;
      data.itemID=key;
      data.userID=this.authServ.getUserDetails().uid;
      data.timestamp=this.message.getTimeStamp().toJSON();
      data.username=this.username;
      this.itemDoc.set(data);
    });
  }
}
