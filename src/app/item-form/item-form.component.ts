import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl   } from '@angular/forms';
import { Item } from '../services/item.service';
import { GeoService } from '../services/geo-service.service';
import { ItemService } from '../services/item.service';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';
import {User} from '../services/authentication.service'
import * as firebase from 'firebase/app';
import { PostcodeService } from '../services/postcode.service';
import { firestore } from 'firebase/app'
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})

export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  item: any;
  user: User | null;
  itemData: Item;
  selectedFile: File = null;
  loggedIn: boolean = false;
  
  constructor(private fb: FormBuilder, private itemservice: ItemService, private auth: AuthenticationService, private alert: AlertService,
  private post: PostcodeService, private router: Router) {
    
  }

  ngOnInit() {
    this.createForm();
    this.auth.getUser().subscribe(auth => {
      if(auth == undefined && auth ==null){
        this.loggedIn=false;
        this.alert.update('You need to be logged in to add a new listing!', 'error');
      }
      else{
        this.user=auth
        this.loggedIn=true;
        this.itemForm.controls.location.setValue(this.user.postcode);
      }
    });
  }
  createForm(){
    this.itemForm = this.fb.group({
      title: ['', Validators.required],
      description: '',
      location: ['', Validators.required],
      enablelocation: false
    })
  }
  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position=>{
        let location = new firestore.GeoPoint(position.coords.latitude,position.coords.longitude);
        this.post.findNearestPostcode(location)
        .subscribe(val => {
          if(val.result==null){
            this.alert.update('The Postcode Service is currently not available. Please manually input your postcode.', 'error')
          }
          else{
            this.itemForm.controls.location.setValue(val.result[0].postcode);
          }
        });
      });
    }
    else{
      this.alert.update('Browser Denied Location! Please manually input your postcode.', 'error')
    }
  }
  getCoordinates(){
    this.post.checkPostCode(this.itemForm.controls.location.value).subscribe(x =>{ 
      if(x.result===false){
        this.alert.update('Please enter a valid postcode!','error');
      }
      else{
        this.newItem();
      }});  
  }
  newItem(){
    this.post.getPostCode(this.itemForm.controls.location.value).subscribe(x =>{
      this.itemData=this.itemForm.value;
      this.itemData.location=new firestore.GeoPoint(x.result.latitude, x.result.longitude);
      if(this.selectedFile != null){
        this.itemservice.createItemwithImage(this.itemData, this.selectedFile);
        this.router.navigate(['/home']);
      }
      else{
        this.itemservice.createItem(this.itemData);
        this.router.navigate(['/home']);
      }
    });
  }
  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
  }
}
