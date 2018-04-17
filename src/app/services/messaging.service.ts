import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../services/authentication.service';
import * as firebase from 'firebase/app';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import {User} from './authentication.service'
import {Message} from './message'

@Injectable()

export class MessagingService {
  messages: AngularFireList<Message>
  user: firebase.User | null;
  message: Message;
  username: string | null;

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, private fire: AngularFirestore) {
    this.auth.authState.subscribe(auth => {
      if(auth !== undefined && auth !==null){
        this.user=auth;
 
        this.fire.doc<User>('users/'+auth.uid).valueChanges()
        .subscribe(x =>{
        this.username=x.username;
      })
    }
  });
}

sendMessage(msg: string, receiveruid: string) {
if(msg===''){
  return;
}
const timestamp = this.getTimeStamp().toJSON();
console.log(timestamp)
const email = this.user.email;
this.messages = this.getMessages(receiveruid);
this.messages.push({
  message: msg,
  timeSent: timestamp,
  userName: this.username,
  email: email 
});
}

getMessages(messageid: string): AngularFireList<Message> {
console.log('message ID: '+messageid)
return this.db.list('/messages/'+messageid, ref => ref.limitToLast(5).orderByKey());
}
compareStrings(string1, string2: boolean){
  if(string1<string2){
    return true
  }
  else{
    return false
  }
}

getStringID(string1, string2): string{
  if(this.compareStrings(string1, string2)){
    return string1+string2;
  }
  else{
    return string2+string1
  }
}
getTimeStamp(): Date{
  const now = new Date();
  let year = now.getFullYear()
  let month = now.getMonth()
  let day = now.getDay()
  let hour = now.getUTCHours()
  let minute = now.getUTCMinutes()
  let seconds = now.getUTCSeconds()
  return new Date(year, month, day, hour, minute, seconds);
}
}
