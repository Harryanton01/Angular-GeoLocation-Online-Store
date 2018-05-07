import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireList, AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemService } from './services/item.service';
import { AgmCoreModule } from '@agm/core';
import { GoogleMapComponent } from './google-map/google-map.component';
import { GeoService } from './services/geo-service.service';
import { MatDividerModule, MatButtonModule, MatCheckboxModule, 
MatGridListModule, MatGridList, MatCardModule, MatFormFieldModule,
MatInputModule, MatToolbarModule, MatMenuModule, MatIconModule, 
MatSlideToggleModule, MatDialogModule, MatDialog, MatSliderModule } from '@angular/material';
import { ItemFormComponent } from './item-form/item-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UploadService } from './uploads/upload.service';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AuthenticationService } from './services/authentication.service';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { AlertService } from './services/alert.service';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { HttpClientModule } from '@angular/common/http';
import { PostcodeService } from './services/postcode.service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertComponent } from './alert/alert.component';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { HomeComponent } from './home/home.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { MessagingService } from './services/messaging.service';
import { ChatfeedComponent } from './chat/chatfeed/chatfeed.component';
import { ChatroomComponent } from './chat/chatroom/chatroom.component';
import { ChatinputComponent } from './chat/chatinput/chatinput.component';
import { UserlistComponent } from './chat/userlist/userlist.component';
import { MessageComponent } from './chat/message/message.component'
import { AgmDirectionModule } from 'agm-direction';
import { UpdateFormComponent } from './update-form/update-form.component';
import { NotificationService } from './notification.service';

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    GoogleMapComponent,
    ItemFormComponent,
    ItemDetailsComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    AlertComponent,
    TopNavigationComponent,
    HomeComponent,
    LoadingSpinnerComponent,
    ChatfeedComponent,
    ChatroomComponent,
    ChatinputComponent,
    UserlistComponent,
    MessageComponent,
    UpdateFormComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatGridListModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatIconModule,
    InfiniteScrollModule,
    MatSlideToggleModule,
    AgmDirectionModule,
    MatDialogModule,
    MatSliderModule
  ],
  providers: [ItemService, GeoService, UploadService, AuthenticationService, AlertService, PostcodeService, MessagingService, NotificationService],
  bootstrap: [AppComponent],
  entryComponents: [UpdateFormComponent]
})
export class AppModule {}
 
