import { Component, OnInit, Input } from '@angular/core';
import {Item, ItemService} from '../services/item.service'
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UpdateFormComponent } from '../update-form/update-form.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  @Input() item: Item;
  user: firebase.User | null;
  itemDetails : Item;
  loggedIn: boolean = false;
  displayLocation: boolean = false;
  personalItem: boolean = false;
  itemID=this.route.snapshot.paramMap.get('itemID');
  loggedInUsername: string;
  itemUsername: string;

  constructor(private router: Router, private route: ActivatedRoute, private itemService: ItemService, private db: AngularFireDatabase, 
    private auth: AngularFireAuth, private updateForm: MatDialog, private firestore: AngularFirestore, private alert: AlertService) { }

  ngOnInit() {
    this.auth.authState.subscribe(auth => {
      if(auth != undefined || auth != null){
        this.user=auth;
        this.loggedIn=true;
      }
      else{
        console.log(this.user)
        this.user=null;
        this.loggedIn=false;
      }
    });
    console.log(this.user)
    this.getItem();    
  }
  getItem(): void {
    this.itemService.getItem(this.itemID)
      .subscribe(item => {
        this.item = item;
        if(item.enablelocation===true){
          this.displayLocation=true;
        }
        else{
          this.displayLocation=false;
        }
        if(this.user!=null || this.user!=undefined){
          if(item.userID===this.user.uid){
            this.personalItem=true;
          }
          this.firestore.doc<User>('users/'+this.user.uid).valueChanges().take(1).subscribe(x =>{
            this.loggedInUsername = x.username;
          });
        }
        this.firestore.doc<User>('users/'+item.userID).valueChanges().take(1).subscribe(x =>{
          this.itemUsername = x.username;
        });
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
    
    this.db.object('chatrooms/'+id).set(
      {
        roomInitialiser: this.user.uid,
        secondUser: this.item.userID,
        roomInitialiserAlias: this.loggedInUsername,
        secondUserAlias: this.itemUsername,
        initRead: true,
        secondRead: true,
        chatID: id
      }
    )
    this.router.navigate(['/chat/'+id]);
  }
  openUpdateForm(){
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.data = this.item;
    this.updateForm.open(UpdateFormComponent, config);
  }
  delete(){
    if(confirm("Are you sure you want to delete this item?")){
      this.itemService.deleteItem(this.item.itemID);
      this.router.navigate(['/home']);
    }
  }
}
