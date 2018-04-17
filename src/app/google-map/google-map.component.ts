import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ItemService } from '../services/item.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../services/authentication.service'
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  @Input() itemID: string

  lat: number;
  long: number;
  itemlat: number;
  itemlong: number;
  loggedIn: boolean=false;
  dir=undefined;
 
  constructor(private itemService: ItemService, private auth: AngularFireAuth, private db: AngularFirestore, private alert: AlertService) {
    
  }
  ngOnInit() {
    console.log('init')
    //this.geo.
    this.auth.authState.subscribe(auth => {
      if(auth !== undefined && auth !==null){
        this.db.doc<any>('users/'+auth.uid).valueChanges()
        .subscribe(x =>{
        this.lat=x.location._lat
        this.long=x.location._long
        this.loggedIn=true;
        this.itemService.getItem(this.itemID).subscribe(x =>{
          this.itemlat=x.location._lat;
          this.itemlong=x.location._long
          this.dir = {
            startingPoint: {lat:this.lat,lng:this.long},
            destination: {lat:x.location._lat,lng:x.location._long}
          }
        });
      })
    }
    else{
      this.loggedIn=false;
      this.alert.update('Please login to view location or to message user', 'info')
    }
  });
  }
}
