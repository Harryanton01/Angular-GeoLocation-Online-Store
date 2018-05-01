import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl   } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { firestore } from 'firebase/app'
import { PostcodeService } from '../services/postcode.service';
import { PostcodeValidator } from '../validators/postcode.validator';
import { Item, ItemService } from '../services/item.service';

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class UpdateFormComponent implements OnInit {

  form: FormGroup;
  title: string;
  description: string;
  location: firestore.GeoPoint;
  enableLocation: boolean;
  selectedFile: File = null;
  updatedItem: Item;


  constructor(private formbuilder: FormBuilder, private dialog: MatDialogRef<UpdateFormComponent>,
  @Inject(MAT_DIALOG_DATA) data, private post: PostcodeService, private itemService : ItemService) { 
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.enableLocation = data.enablelocation;
    this.updatedItem = data;
  }

  ngOnInit() {
    this.form = this.formbuilder.group({
      title: ['', Validators.required],
      description: '',
      location: ['', [Validators.required], PostcodeValidator.validatePostcode(this.post)],
      enablelocation: false
    })
    this.form.controls.title.setValue(this.title);
    this.form.controls.description.setValue(this.description);
    this.post.findNearestPostcode(this.location).subscribe(x =>{
      this.form.controls.location.setValue(x.result[0].postcode)
    });
    this.form.controls.enablelocation.setValue(this.enableLocation);
    
  }

  save() {
    
    this.post.getPostCode(this.form.controls.location.value).subscribe(x =>{
      this.updatedItem.title = this.form.controls.title.value;
      this.updatedItem.description = this.form.controls.description.value;
      this.updatedItem.location = new firestore.GeoPoint(x.result.latitude, x.result.longitude);
      this.updatedItem.enablelocation = this.form.controls.enablelocation.value;
      if(this.selectedFile!=null){
        this.itemService.updateItemwithImage(this.updatedItem, this.selectedFile);
      }
      this.itemService.updateItem(this.updatedItem);
      this.dialog.close(this.form.value);
    });
  }
  close() {
    this.dialog.close();
  }

  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
  }

}
