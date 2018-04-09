import { Component, OnInit, Input } from '@angular/core';
import {item, ItemService} from '../services/item.service'
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  @Input() item: item;
  constructor(private route: ActivatedRoute, private itemService: ItemService) { }

  ngOnInit() {
    this.getItem();
  }
  getItem(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.itemService.getItem("pV4IdsPFT97wRh9VvaS3")
      .subscribe(hero => this.item = hero);
  }

}
