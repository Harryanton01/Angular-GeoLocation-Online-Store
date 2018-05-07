import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component'
import { ItemDetailsComponent } from './item-details/item-details.component';
import { ItemListComponent } from './item-list/item-list.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { HomeComponent } from './home/home.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { ChatfeedComponent } from './chat/chatfeed/chatfeed.component';
import { UserlistComponent } from './chat/userlist/userlist.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'itemlist', component: ItemListComponent},
  { path: 'login', component: LoginFormComponent},
  { path: 'newitem', component: ItemFormComponent},
  { path: 'register', component: RegistrationFormComponent},
  { path: 'details/:itemID', component: ItemDetailsComponent},
  { path: 'chat/:chatID', component: ChatfeedComponent},
  { path: 'messages', component: UserlistComponent}
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
