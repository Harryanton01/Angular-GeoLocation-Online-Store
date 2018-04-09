import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeoServiceService } from '../services/geo-service.service'
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  lat: number;
  lng: number;
  markers: any;
  subscription: any;
  constructor(private geo: GeoServiceService) {

  }
  ngOnInit() {
    this.getUserLocation();
    this.subscription = this.geo.hits
        .subscribe(hits => this.markers = hits);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getUserLocation() {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        console.log("lat: "+this.lat+" long: "+this.lng);
        this.geo.getLocations(0.75, [this.lat, this.lng]);
      });
    }
  }
}
