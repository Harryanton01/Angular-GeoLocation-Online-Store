import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from '@firebase/util';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  
  users: any;
  users2: any;
  user: firebase.User;
  messageID: string;

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, private alert: AlertService) { }

  ngOnInit() {
    this.alert.clear();
    this.auth.authState.subscribe(auth => {
      if(auth !== undefined && auth !==null){
        this.user=auth;
        this.getUserList();
      }
      else{
        this.alert.update('You need to be logged in!', 'error')
      }
    });
  }
  getUserList(){
    this.users=this.db.list('chatrooms', ref => ref.orderByChild('roomInitialiser').equalTo(this.user.uid)).valueChanges()
    this.users2=this.db.list('chatrooms', ref => ref.orderByChild('secondUser').equalTo(this.user.uid)).valueChanges()
  }

}
