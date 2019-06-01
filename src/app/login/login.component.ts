import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  invalidForm: boolean;

  constructor(public router: Router, private fAuth: AngularFireAuth) { }

  ngOnInit() {
  }
  
  login() {
    this.fAuth.auth.signInWithEmailAndPassword(this.email, this.password)
    .then(value => {
      this.router.navigate(['/cart/checkout']);
    })
    .catch(err => {
      this.invalidForm = true;
    });
  }

}
