import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app'

@Injectable()
export class PostcodeService {

  constructor(private http: HttpClient) { }

  getPostCode(postcode: string): Observable<any>{
    return this.http.get('https://api.postcodes.io/postcodes/'+postcode).take(1);
  }
  checkPostCode(postcode: string): Observable<any>{
    console.log(typeof this.http.get('https://api.postcodes.io/postcodes/'+postcode+'/validate'));
    return this.http.get('https://api.postcodes.io/postcodes/'+postcode+'/validate').take(1);
  }
  findNearestPostcode(geoPoint: firestore.GeoPoint): Observable<any>{
    return this.http.get('https://api.postcodes.io/postcodes?lon='+geoPoint.longitude+'&lat='+geoPoint.latitude).take(1);
  }
}
