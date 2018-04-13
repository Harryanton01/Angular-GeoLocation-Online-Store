import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService, item } from '../services/item.service';
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

@Component({
  selector: 'app-home',
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  showSpinner: boolean = false;
  private itemarray: Observable<item[]>

  constructor(private router: Router, private itemService: ItemService, private post: PostcodeService, private alert: AlertService, 
    private db: AngularFirestore, private geoDB: AngularFireDatabase) { }
  
  ngOnInit(){
      console.log('HomePage Initialised');
      
  }
  
  search(){
    var inputValue = (<HTMLInputElement>document.getElementById('postcode')).value;
    this.post.checkPostCode(inputValue).subscribe(x =>{ 
      console.log('sub')
      this.showSpinner=true
      if(x.result===false){
        this.alert.update('Invalid Postcode!','error');
        this.showSpinner=false;
      }
      else{
        this.getItems()
      }
    }
  );
    
  }
  getItems(){
    var inputValue = (<HTMLInputElement>document.getElementById('postcode')).value;
    this.post.getPostCode(inputValue).subscribe(x =>{
      console.log(x);
      this.showSpinner=true
      this.alert.update('Sorry Boss no items near you :(','error');
      this.itemarray=this.itemService.getItems(x.result.latitude, x.result.longitude, 10);
      this.itemarray.subscribe(() => {
        this.alert.clear()
        this.showSpinner=false
      });
    });
    this.showSpinner=false;
  }
}
