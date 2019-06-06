import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  invalidForm: boolean;
  constructor(private fAuth: AngularFireAuth, public router: Router) { }

  ngOnInit() {
    document.getElementById("email").focus();
    document.getElementById("pass-input").style.display = "none";
  }

  register() {
    this.fAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
    .then(value => {
      this.router.navigate(['/cart/checkout']);
    })
    .catch(err => {
      this.invalidForm = true;
    });
  }


}
