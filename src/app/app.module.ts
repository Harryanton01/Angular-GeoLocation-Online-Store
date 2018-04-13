import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireList } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemService } from './services/item.service';
import { AgmCoreModule } from '@agm/core';
import { GoogleMapComponent } from './google-map/google-map.component';
import { GeoServiceService } from './services/geo-service.service';
import { MatDividerModule, MatButtonModule, MatCheckboxModule, 
MatGridListModule, MatGridList, MatCardModule, MatFormFieldModule,
MatInputModule, MatToolbarModule, MatMenuModule, MatIconModule } from '@angular/material';
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
import { MessageComponent } from './message/message.component';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { HomeComponent } from './home/home.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component'

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    GoogleMapComponent,
    ItemFormComponent,
    ItemDetailsComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    MessageComponent,
    TopNavigationComponent,
    HomeComponent,
    LoadingSpinnerComponent
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
    FormsModule,                               // <========== Add this line!
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatIconModule,
    InfiniteScrollModule
  ],
  providers: [ItemService, GeoServiceService, UploadService, AuthenticationService, AlertService, PostcodeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
