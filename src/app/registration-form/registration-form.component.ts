import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import * as postcodeIO from 'postcodesio-client';
import { PostcodeService } from '../services/postcode.service';
import 'rxjs/add/operator/debounceTime';
import {Observable} from 'rxjs'
import { AbstractControl } from '@angular/forms';
import { PostcodeValidator } from '../validators/postcode.validator';
import { UsernameValidator } from '../validators/username.validator';
import 'rxjs/add/operator/take';
import { firestore } from 'firebase/app'
import { GeoServiceService } from '../services/geo-service.service';


type UserFields = 'email' | 'password' |'postcode' | 'username';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})

export class RegistrationFormComponent implements OnInit {
  
  validPost: boolean=false;
  registrationForm: FormGroup;
  formErrors: FormErrors = {
    'email': '',
    'password': '',
    'postcode': '',
    'username': ''
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email',
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    },
    'postcode':{
      'required': 'Postcode is required',
      'validPostcode': 'Postcode is invalid'
    },
    'username':{
      'required': 'Username is required',
      'validUsername': 'This username already exists'
    }
  };

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private post: PostcodeService,
  private geoService: GeoServiceService) { }

  ngOnInit() {
    this.buildForm();
  }
  
  buildForm() {
    this.registrationForm = this.fb.group({
      'postcode': ['', [Validators.required], PostcodeValidator.validatePostcode(this.post)],
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'username': ['',[Validators.required], UsernameValidator.validateUsername(this.auth)],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
      ]],
    });
    this.registrationForm.valueChanges.debounceTime(1000).subscribe((data) =>{
      this.onValueChanged(data);
    });
    this.onValueChanged();
  }
  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position=>{
        let location = new firestore.GeoPoint(position.coords.latitude,position.coords.longitude);
        this.post.findNearestPostcode(location)
        .subscribe(val => {
          this.registrationForm.controls.postcode.setValue(val.result[0].postcode);
        });
      });
    }
    else{
      console.log('Browser Denied Location!')
    }
  }
  register(){
    let email=this.registrationForm.controls.email.value;
    let password=this.registrationForm.controls.password.value;
    let userData = this.registrationForm.value;
    console.log(email+' '+ password + ' '+ userData);
    this.auth.signupWithEmail(email, password , userData);
  }
  onValueChanged(data?: any) {
    if (!this.registrationForm) { return; }
    const form = this.registrationForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) 
      && (field === 'email' || field === 'password' || field === 'postcode' || field === 'username')) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key) ) {
                this.formErrors[field] += `${(messages as {[key: string]: string})[key]} `;
              }
            }
          }
        }
      }
    }
  }

}
