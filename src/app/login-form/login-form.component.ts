import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private alert: AlertService, private router: Router, private fb: FormBuilder, private auth: AuthenticationService) { }

  ngOnInit() {
    this.buildForm();
  }

  login() {
    this.auth.login(this.loginForm.value['email'], this.loginForm.value['password'])
    .then(() => this.afterSignIn())
    .catch(error => this.alert.update('Invalid email and/or password!', 'error'));
  }

  buildForm() {
    this.loginForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email,
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
      ]],
    });
  }
  private afterSignIn() {
    this.router.navigate(['/home']);
  }
}
