import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { item, ItemService } from '../services/item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items: Observable<item[]>;
  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.items= this.itemService.getItems();
  }

}
