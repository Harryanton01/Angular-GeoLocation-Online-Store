import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent {
  constructor(public auth: AuthenticationService){}
  show = false;

  toggleCollapse() {
    this.show = !this.show;
  }
  logout(){
    this.auth.logout();
  }

}
