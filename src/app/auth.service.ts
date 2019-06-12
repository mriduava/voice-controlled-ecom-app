import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user: Observable<any>;

  invalidForm: boolean;

  constructor(private fAuth: AngularFireAuth, private router: Router, private zone: NgZone) { 

  }

  signUp(email: string, password: string) {
    this.fAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(value => {
      console.log(value);
      return value;
    })
    .catch(err => {
      return err;
    });
  }

  login(email: string, password: string) {
    this.fAuth.auth.signInWithEmailAndPassword(email, password)
    .then(value => {
      this.invalidForm = false;
      this.zone.run(() => this.router.navigateByUrl('/cart/checkout'))
      // this.router.navigate(['/cart/checkout']);
    })
    .catch(err => {
      console.log(err);
    });
  }

  signOut() {
    this.fAuth.auth.signOut();
  }

  loggedIn() {
    return this.fAuth.authState;
  }

}
