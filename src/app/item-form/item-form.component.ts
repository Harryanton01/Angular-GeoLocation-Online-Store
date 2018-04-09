import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl   } from '@angular/forms';
import { item } from '../services/item.service';
import { GeoServiceService } from '../services/geo-service.service';
import { ItemService } from '../services/item.service';
@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})

export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  item: any;
  itemInput: item;
  selectedFile: File = null;
  constructor(private fb: FormBuilder, private itemservice: ItemService) {
    this.createForm();
  }

  ngOnInit() {

  }
  createForm(){
    this.itemForm = this.fb.group({
      title: ['', Validators.required],
      desc: '',
      location: '',
    })
  }
  newItem(){
    this.itemInput=this.itemForm.value;
    if(this.selectedFile != null){
      this.itemservice.createItemImage(this.itemInput, this.selectedFile);
    }
    else{
      this.itemservice.createItem(this.itemInput);
    }
  }
  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
  }
}
