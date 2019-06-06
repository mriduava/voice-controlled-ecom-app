import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  invalidForm: boolean;

  constructor(public router: Router, private fAuth: AngularFireAuth, private zone: NgZone) { }

  ngOnInit() {
    window.onload = function() {
      var input = document.getElementById("email").focus();
    }

    const logText = () => {
      const msg = new SpeechSynthesisUtterance();    
      msg.text = `You are in login page. ...
                  Please write your email address and press "Enter" . ...
                  If you are not not registered. ..., 
                  Please Register first. ...
                  To get the Register form. ...
                  Plese press "Control" and say "Register". ...`
      speechSynthesis.speak(msg)
    }
    setTimeout(logText, 1000);

    const goRegister = () => {
      this.zone.run(() => this.router.navigateByUrl('/register'))
      speechSynthesis.cancel();
    }

    // SPEECH TO TEXT    
    const {webkitSpeechRecognition} : IWindow = <IWindow>window;
    const recognition = new webkitSpeechRecognition();
    var SpeechGrammarList = SpeechGrammarList ||window['webkitSpeechGrammarList'];
    
    var grammar = '#JSGF V1.0;'
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    // recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = function(event) {
        let last = event.results.length - 1;
        let command = event.results[last][0].transcript;        
        console.log(command);    
        if(command.toLowerCase() === 'register'){          
          goRegister();
        }else if(command.toLowerCase() === 'check out'){ 
      
        }      
    };
    recognition.onspeechend = function() {
        recognition.stop();
    };
    recognition.onerror = function(event) {
      console.log(event.error);
    }  
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
