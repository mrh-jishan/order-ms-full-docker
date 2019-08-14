import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {ProductsComponent} from './products/products.component';
import {OrdersComponent} from './orders/orders.component';
import {PaymentComponent} from './payment/payment.component';
import {AuthGuard} from './auth.guard';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'secure',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'payment/:productId',
        component: PaymentComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
