import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../../services/messaging.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-chatinput',
  templateUrl: './chatinput.component.html',
  styleUrls: ['./chatinput.component.css']
})
export class ChatinputComponent implements OnInit {
  
  message: string;
  user: firebase.User;

  constructor(private chat: MessagingService, private route: ActivatedRoute, private db: AngularFireDatabase, private auth: AngularFireAuth) { }
  private id;
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('chatID');
    this.auth.authState.subscribe(x =>{
      if(x !== undefined && x !==null){
        this.user=x;
      }
    })
  }

  send(){
    this.db.object<any>('chatrooms/'+this.id).valueChanges().take(1).subscribe(x =>{
      if(this.user.uid===x.roomInitialiser){
        let newObject = {
          chatID: x.chatID,
          roomInitialiser: x.roomInitialiser,
          secondUser: x.secondUser,
          roomInitialiserAlias: x.roomInitialiserAlias,
          secondUserAlias: x.secondUserAlias,
          initRead: true,
          secondRead: false
        };
        this.db.object('chatrooms/'+this.id).update(newObject);
      }
      else{
        let newObject = {
          chatID: x.chatID,
          roomInitialiser: x.roomInitialiser,
          secondUser: x.secondUser,
          roomInitialiserAlias: x.roomInitialiserAlias,
          secondUserAlias: x.secondUserAlias,
          initRead: false,
          secondRead: true
        };
        this.db.object('chatrooms/'+this.id).update(newObject);
      }
    });
    this.chat.sendMessage(this.message,this.id);
    this.message=''
  }
  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }
}
