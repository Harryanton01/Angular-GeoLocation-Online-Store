import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { ItemService, item } from './services/item.service';
import { GeoServiceService } from './geo-service.service'
import {AuthenticationService} from './services/authentication.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  constructor(public authServ: AuthenticationService) { }
  ngOnInit(){ }
}