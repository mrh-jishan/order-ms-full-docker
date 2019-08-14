import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../app.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  form: FormGroup;
  productId;

  constructor(private fb: FormBuilder,
              private route: Router,
              private service: AppService,
              routeSnapshot: ActivatedRoute) {
    routeSnapshot.params.subscribe(data => {
      this.productId = data.productId;
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      cardHolderName: [, Validators.compose([Validators.required, Validators.min(6)])],
      cardNumber: [, Validators.compose([Validators.required, Validators.min(6)])],
      cvc: [, Validators.compose([Validators.required, Validators.min(6)])],
      cardExpiryMonth: [, Validators.compose([Validators.required, Validators.min(2)])],
      cardExpiryYear: [, Validators.compose([Validators.required, Validators.min(2)])],
    });
  }

  pay() {

    const data = this.form.value;
    const paymentObject = {
      createdBy: localStorage.getItem('id'), // only for temp, can use ngrx store to manage this, or behaviourObserval as well, ,
      product: this.productId,
      payment: {
        cardHolderName: data.cardHolderName,
        cardNumber: data.cardNumber,
        expiryDate: `${data.cardExpiryMonth}/${data.cardExpiryYear}`,
        cvc: data.cvc,
        createdBy: localStorage.getItem('id'),
      }
    };
    this.service.payment(paymentObject).subscribe((res: any) => {
      console.log(res);
      if (res.payout.status === 'declined') {
        alert('Sorry! payout declined');
        this.route.navigateByUrl('secure/products');
      } else {
        this.route.navigateByUrl('secure/orders');
      }
    }, ({error}) => {
      alert(error.message);
    });
  }
}
