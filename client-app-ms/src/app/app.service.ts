import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {
  }


  private static getHeader() {
    const token = JSON.parse(localStorage.getItem('token'));
    return new HttpHeaders({
      Authorization: token.tokenType + ' ' + token.accessToken,
      'Content-Type': 'application/json'
    });
  }

  login(body) {
    return this.http.post(environment.url + 'v1/auth/login', body);
  }

  register(body) {
    return this.http.post(environment.url + 'v1/auth/register', body);
  }

  fetchProducts() {
    return this.http.get(environment.url + 'v1/product', {headers: AppService.getHeader()});
  }

  payment(body) {
    return this.http.post(environment.url + 'v1/order', body, {headers: AppService.getHeader()});
  }

  fetchOrderList() {
    return this.http.get(environment.url + 'v1/order', {headers: AppService.getHeader()});
  }

  cancelOrder(body, id) {
    return this.http.put(environment.url + `v1/order/${id}/cancel`, body, {headers: AppService.getHeader()});
  }
}
