import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService, Item } from '../services/item.service';
import { Observable } from 'rxjs/Observable';
import { PostcodeService } from '../services/postcode.service';
import { firestore } from 'firebase/app'
import { AlertService } from '../services/alert.service';
import { CommonModule } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';
import {distinctUntilChanged } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';
import * as _ from 'lodash'
import { AngularFirestore } from 'angularfire2/firestore';
import * as GeoFire from "geofire";
import 'rxjs/add/observable/interval';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { buffer } from 'rxjs/operators';
import { concat, flatMap } from 'rxjs/operators'
import { Subscription } from 'rxjs/Subscription'
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import {User} from '../services/authentication.service'
import { AngularFireModule, FirebaseAppConfigToken } from 'angularfire2';

@Component({
  selector: 'app-home',
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{

  showSpinner: boolean = false;
  private itemarray: Observable<Item[]>
  private selectedItem: Item;
  private user: firebase.User;
  private unsubscribe: Subject<void> = new Subject<void>();
  private distance = 5;

  constructor(private router: Router, private itemService: ItemService, private post: PostcodeService, private alert: AlertService, 
    private db: AngularFirestore, private geoDB: AngularFireDatabase, private auth: AngularFireAuth) { 
      
    }
  
  ngOnInit(){
    this.itemarray=null;
    this.alert.clear();
    this.auth.authState.subscribe(auth => {
      if(auth !== undefined && auth !==null){
        this.user=auth;
        this.queryUserPostcode();
      }
    });
  }
  ngOnDestroy(){
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  onDistanceChange(event: any){
    this.distance = event.value;
    this.search();
  }
  search(){
    this.alert.clear();
    this.itemarray=null;
    var inputValue = (<HTMLInputElement>document.getElementById('postcode')).value;
    if(inputValue===null || inputValue === undefined || inputValue===''){
      this.alert.update('Please input a valid postcode!','error');
      return;
    }
    this.post.checkPostCode(inputValue).subscribe(x =>{ 
      this.showSpinner=true
      if(x.result===false){
        this.alert.update('Invalid Postcode!','error');
        this.showSpinner=false;
      }
      else{
        this.getItems();
      }});  
  }
  queryUserPostcode(){
    this.db.doc<User>('users/'+this.user.uid).valueChanges().subscribe(x =>{
      (<HTMLInputElement>document.getElementById('postcode')).value=x.postcode;
    })
  }
  getItems(){
    var inputValue = (<HTMLInputElement>document.getElementById('postcode')).value;
    this.post.getPostCode(inputValue).subscribe(x =>{
      this.showSpinner=true
      setTimeout(()=>{
        if(this.showSpinner===true && this.itemarray!==null){
          this.alert.update('There are no items near you :(','error');
          this.itemarray=null;
        }
        this.showSpinner=false;
      },2500);
      this.itemarray = new Observable<Item[]>()
      this.itemarray=this.itemService.getItems(x.result.latitude, x.result.longitude, this.distance)
      .takeUntil(this.unsubscribe);
      this.itemarray.subscribe(() => {
        this.alert.clear();
        this.showSpinner=false;
      });
    });
    ;
  }
  onItemSelect(item: Item){
    this.selectedItem=item;
  }
  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position=>{
        let location = new firestore.GeoPoint(position.coords.latitude,position.coords.longitude);
        this.post.findNearestPostcode(location)
        .subscribe(val => {
          if(val.result==null){
            this.alert.update('The Postcode Service is currently not available. Please manually input your postcode.', 'error')
          }
          else{
            (<HTMLInputElement>document.getElementById('postcode')).value=val.result[0].postcode;
          }
        });
      });
    }
    else{
      this.alert.update('Browser Denied Location! Please manually input your postcode.', 'error')
    }
  }
}
