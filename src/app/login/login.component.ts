import { Component, OnInit, NgZone,Input } from '@angular/core';
import { NgxKeyboardEventsService, NgxKeyboardEvent } from 'ngx-keyboard-events';
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
  @Input()
  email: string;
  password: string;
  invalidForm: boolean;

  constructor(public router: Router, private fAuth: AngularFireAuth, private zone: NgZone, private keyListen: NgxKeyboardEventsService) { }

  ngOnInit() { 
    // TO FOCUS EMAIL INPUT & TO HIDE PASS INPUT
    document.getElementById("email").focus();
    document.getElementById("pass-input").style.display = "none";  
    
    // LOG IN PAGE VOICE TEXT
    const logText = () => {
      const msg = new SpeechSynthesisUtterance();    
      msg.text =  `You are in login page. ...
                  If you are not registered yet. ..., 
                  Please Register first. ...
                  To get the Register form. ...
                  Plese press "Control" and say "Sign Up". ...`
      speechSynthesis.speak(msg)
      const emailText = () => {
        const msg = new SpeechSynthesisUtterance();    
        msg.text = `To Login. ...
                    Please write your email address and press "Enter" . ...`
        speechSynthesis.speak(msg)
      }
      setTimeout(emailText, 3000);
  
    }
    setTimeout(logText, 1000);

    
    // VOICE TEXT TO FILL PASSWORD
    const passText = () => {
      const msg = new SpeechSynthesisUtterance();    
      msg.text = `Please write your password and press "Enter" . ...`
      speechSynthesis.speak(msg)
    }
 
    // TO NAVIGATE TO REGiSTER PAGE
    const goRegister = () => {
      this.zone.run(() => this.router.navigateByUrl('/register'))
      speechSynthesis.cancel();
    }

    const goLogin = () => {
      this.zone.run(() => this.router.navigateByUrl('/login'))
      speechSynthesis.cancel();
    }

    // TO ACTIVE KEY CONTROL
    this.keyListen.onKeyPressed.subscribe((keyEvent: NgxKeyboardEvent) => {
      if(keyEvent.code == 13){       
        document.getElementById("pass-input").style.display = "block";
        document.getElementById("password").focus();
        passText();
              
      }else if(keyEvent.code == 17) {
        speechSynthesis.cancel();
        recognition.start();
      }
    });

    // SPEECH TO TEXT
    const {webkitSpeechRecognition} : IWindow = <IWindow>window;
    const recognition = new webkitSpeechRecognition();
    var SpeechGrammarList = SpeechGrammarList ||window['webkitSpeechGrammarList'];

    var grammar = '#JSGF V1.0;'
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
        let last = event.results.length - 1;
        let command = event.results[last][0].transcript;
        console.log(command);
        if(command.toLowerCase() === 'sign up'){
          goRegister();
        }else if(command.toLowerCase() === 'sign in'){
          goLogin()
        }
    };
    recognition.onspeechend = () => {
        recognition.stop();
    };
    recognition.onerror = (event: any) => {
      console.log(event.error);
    }
  }
  
  // FUNCTION TO LOG IN
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
