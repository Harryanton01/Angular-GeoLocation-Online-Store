import { Component, OnInit, Input } from '@angular/core';
import {Item, ItemService} from '../services/item.service'
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  @Input() item: Item;
  user: firebase.User;
  loggedIn: boolean = false;
  displayLocation: boolean = false;
  itemID=this.route.snapshot.paramMap.get('itemID');
  constructor(private route: ActivatedRoute, private itemService: ItemService, private db: AngularFireDatabase, private auth: AngularFireAuth) { }

  ngOnInit() {
    this.auth.authState.subscribe(auth => {
      if(auth !== undefined && auth !==null){
        this.user=auth;
        this.loggedIn=true;
      }
      else{
        this.user=null;
        this.loggedIn=false;
      }
    });
    this.getItem();
  }
  getItem(): void {
    this.itemService.getItem(this.itemID)
      .subscribe(hero => {
        this.item = hero;
        console.log(hero.enablelocation)
        if(hero.enablelocation===true){
          this.displayLocation=true;
        }
      });
  }
  convertString(): string{
    if(this.user.uid<this.item.userID){
      return this.user.uid+this.item.userID;
    }
    else{
      return this.item.userID+this.user.uid;
    }
  }
  message(){
    let id = this.convertString();
    console.log(id)
    this.db.object('chatrooms/'+id).set(
      {
        roomInitialiser: this.user.uid,
        secondUser: this.item.userID,
        chatID: id
      }
    )
  }
}
