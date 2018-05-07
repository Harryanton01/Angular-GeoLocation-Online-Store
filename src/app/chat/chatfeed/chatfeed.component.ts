import { Component, OnInit, Input } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Message } from '../../services/message'
import { MessagingService } from '../../services/messaging.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-chatfeed',
  templateUrl: './chatfeed.component.html',
  styleUrls: ['./chatfeed.component.css']
})
export class ChatfeedComponent implements OnInit {

  list: AngularFireList<Message>;
  feed: Observable<Message[]>;
  loggedIn: boolean = false;
  authorised: boolean = false;
  user: firebase.User;

  constructor(private chat: MessagingService, private route: ActivatedRoute, private auth: AngularFireAuth, private db: AngularFireDatabase,
  private alert: AlertService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('chatID');
    this.auth.authState.subscribe(auth => {
      if(auth !== undefined && auth !==null){
        this.user=auth;
        this.loggedIn=true;
        this.alert.clear();
        this.db.object<any>('/chatrooms/'+id).valueChanges()
        .subscribe(x=>{
          if(x.roomInitialiser===this.user.uid || x.secondUser===this.user.uid){
            if(x.roomInitialiser===this.user.uid && x.initRead==false){
              this.db.object<any>('/chatrooms/'+id).update({initRead: true});
            }
            if(x.secondUser===this.user.uid && x.secondUser==false){
              this.db.object<any>('/chatrooms/'+id).update({secondUser: true});
            }
            this.list=this.chat.getMessages(id);
            this.feed=this.list.valueChanges();
            this.alert.clear();
            this.authorised=true;
          }
          else{
            this.authorised=false;
            this.alert.update('You must be an authorised user to view these messages', 'error');
          }
       }); 
      }
      else{
        this.user=null;
        this.loggedIn=false;
        this.authorised=false;
        this.alert.update('You must be logged in as an authorised user to access this chat', 'error');
      }
    });  
  }
}
