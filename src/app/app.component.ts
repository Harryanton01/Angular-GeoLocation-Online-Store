import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { ItemService, Item } from './services/item.service';
import { GeoServiceService } from './geo-service.service'
import {AuthenticationService} from './services/authentication.service'
import { NotificationService } from './notification.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  message;
  constructor(public authServ: AuthenticationService) { }
  ngOnInit(){ 
  }
}
