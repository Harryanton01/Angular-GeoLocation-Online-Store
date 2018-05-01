import { Component, OnInit} from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from '@firebase/util';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AlertService } from '../../services/alert.service';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  
  users = new BehaviorSubject([]);
  users2 = new BehaviorSubject([]);
  user: firebase.User;
  messageID: string;
  firstUnread: boolean;
  userID: string | null;
  

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, private alert: AlertService, private firestore: AngularFirestore) { }

  ngOnInit() {
    this.firstUnread = false;
    this.alert.clear();
    this.auth.authState.subscribe(auth => {
      if(auth !== undefined && auth !==null){
        this.user=auth;
        this.userID=this.user.uid;
        this.getUserList();
      }
      else{
        this.alert.update('You need to be logged in!', 'error')
      }
    });
    this.users.subscribe(x =>{
      console.log(x)
    })
  }
  getUserList(){
    this.db.list<any>('chatrooms', ref => ref.orderByChild('secondUser').equalTo(this.user.uid)).valueChanges().subscribe(x =>{
      console.log(x)
      this.users.next(x);
      this.db.list<any>('chatrooms', ref => ref.orderByChild('roomInitialiser').equalTo(this.user.uid)).valueChanges().subscribe(x =>{
        console.log(x)
        this.users2.next(x);
      });
    });
  }
  getList(){
    
  }
  clearUnread(chat: any){
    console.log(chat)
    if(chat.secondUser==this.user.uid){
      let newObject = {
        secondRead: true
      };
      this.db.object('chatrooms/'+chat.chatID).update(newObject);
    }
    else if (chat.roomInitialiser==this.user.uid){
      let newObject = {
        initRead: true
      };
      this.db.object('chatrooms/'+chat.chatID).update(newObject);
    }
  }

}
