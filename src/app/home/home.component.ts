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
import { AngularFirestore } from 'angularfire2/firestore';
import * as GeoFire from "geofire";
import 'rxjs/add/observable/interval';



@Component({
  selector: 'app-home',
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{

  public itemarray: Observable<Array<any>>;
  item: Observable<item>;
  constructor(private router: Router, private itemService: ItemService, private post: PostcodeService, private alert: AlertService, 
    private db: AngularFirestore, private geoDB: AngularFireDatabase) { }
  
  ngOnInit(){
      console.log('HomePage Initialised');
      this.itemarray=this.itemService.getItems(51.640877, -0.167901, 10);
  }
}
