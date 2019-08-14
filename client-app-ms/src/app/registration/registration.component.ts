import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private service: AppService,
              private route: Router) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [, Validators.compose([Validators.required, Validators.min(6)])],
      email: [, Validators.compose([Validators.required, Validators.email])],
      password: [, Validators.compose([Validators.required, Validators.min(6)])]
    });
  }

  registration() {
    this.service.register(this.form.value).subscribe((res: any) => {
      localStorage.setItem('token', JSON.stringify(res.token));
      localStorage.setItem('id', res.user.id);
      this.route.navigateByUrl('secure/products');
    }, ({error}) => {
      alert(error.message);
    });
  }
}
