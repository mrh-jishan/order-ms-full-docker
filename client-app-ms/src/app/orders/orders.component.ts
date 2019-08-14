import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AppService} from '../app.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders$: Observable<any>;

  constructor(private service: AppService) {
    this.orders$ = service.fetchOrderList();
  }

  ngOnInit() {
    // setInterval(() => {
    //   this.orders$ = this.service.fetchOrderList();
    // }, 5000);
  }


  cancelOrder(item) {
    this.service.cancelOrder({}, item.id).subscribe(res => {
      alert('Success');
    }, ({error}) => {
      alert(error.message);
    }, () => {
      this.orders$ = this.service.fetchOrderList();
    });
  }
}
