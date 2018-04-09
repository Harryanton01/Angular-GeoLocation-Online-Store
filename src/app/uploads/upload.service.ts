import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Upload } from './upload';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable()
export class UploadService {

  constructor(private afStorage: AngularFireStorage) { }

  upload(event,key){
    this.afStorage.upload(key,event.target.files[0]);
  }

}
