import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {
  
  constructor(public auth: AuthenticationService, private geoDB: AngularFireDatabase, private authenticationService: AngularFireAuth){}
  read = false;
  ngOnInit(){
    this.authenticationService.authState.subscribe(auth => {
      if(auth !== undefined && auth !==null){
        this.geoDB.list<any>('chatrooms', ref => ref.orderByChild('secondUser').equalTo(auth.uid)).valueChanges().subscribe(x =>{
          for(let i of x){
            this.read=i.secondRead;
          }
          this.geoDB.list<any>('chatrooms', ref => ref.orderByChild('roomInitialiser').equalTo(auth.uid)).valueChanges().subscribe(x =>{
            for(let i of x){
                this.read=i.initRead
            }
          });
        });
      }
    });
  }
  logout(){
    this.auth.logout();
  }

}
