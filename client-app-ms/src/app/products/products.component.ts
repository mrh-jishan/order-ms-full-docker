import {Component, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products$: Observable<any>;

  constructor(private service: AppService,
              private route: Router) {
    this.fetchProducts();
  }

  ngOnInit() {
  }

  fetchProducts() {
    this.products$ = this.service.fetchProducts();
  }

  orderNow(item) {
    this.route.navigateByUrl('secure/payment/' + item.id);
  }
}
