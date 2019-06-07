import { Component, OnInit, NgZone } from '@angular/core';
import { NgxKeyboardEventsService, NgxKeyboardEvent } from 'ngx-keyboard-events';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  invalidForm: boolean;
  constructor(private fAuth: AngularFireAuth, public router: Router,
              private zone: NgZone, private keyListen: NgxKeyboardEventsService) { }

  ngOnInit() {
    document.getElementById("email").focus();
    document.getElementById("pass-input").style.display = "none";
      // LOG IN PAGE VOICE TEXT
      const logText = () => {
        const msg = new SpeechSynthesisUtterance();    
        msg.text =  `You are in Register page. ...
                    If you are already registered. ..., 
                    Please Sign In with your email and Password. ...
                    To get the "Sign In" form. ...
                    Plese press "Control" and say "Sign In". ...`
        speechSynthesis.speak(msg)
        const emailText = () => {
          const msg = new SpeechSynthesisUtterance();    
          msg.text = `To Register. ...
                      Please write your email address and press "Enter" . ...`
          speechSynthesis.speak(msg)
        }
        setTimeout(emailText, 3000);
    
      }
      setTimeout(logText, 1000);
  
      
      // VOICE TEXT TO FILL PASSWORD
      const passText = () => {
        const msg = new SpeechSynthesisUtterance();    
        msg.text = `Password should be atleast 6 characters. ...
                    Please write correct passord and press "Enter. ...`
        speechSynthesis.speak(msg)
      }
   
      // TO NAVIGATE TO LOG IN PAGE
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
          if(keyEvent.code == 13){
              speechSynthesis.cancel(); 
          }         
        }else if(keyEvent.code === 17) {
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
          if(command.toLowerCase() === 'sign in'){
            goLogin();
          }
      };
      recognition.onspeechend = () => {
          recognition.stop();
      };
      recognition.onerror = (event: any) => {
        console.log(event.error);
      }
  }
  
  // FUNCTION TO REGISTER
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
