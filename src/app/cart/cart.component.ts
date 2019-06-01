import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartData: any = [];

  constructor(private store: StoreService) { }

  ngOnInit() {
    this.cartData = this.store.cartData;
    console.log(this.cartData);
    
  }

}
