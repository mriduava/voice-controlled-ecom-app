import { Component, OnInit, NgZone } from '@angular/core';
import { NgxKeyboardEventsService, NgxKeyboardEvent } from 'ngx-keyboard-events';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from 'firebase';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  user: firebase.User;

  email = [];

  constructor(public router: Router, private zone: NgZone, 
              private keyListen: NgxKeyboardEventsService, private serve: AuthService) { }

  ngOnInit() {
    // USER INFO
    this.serve.loggedIn()
    .subscribe(user => {
      this.user = user;

      this.email.push(user.providerData[0].email);
      console.log(this.email);
      
    });

    // INTRO TEXT IN CHECKOUT 
    const chekoutText = () => {
      const msg = new SpeechSynthesisUtterance();    
      msg.text = `Your email address is ${this.email[0]}.... Your Product is going to deliver to this Address. ... `
      speechSynthesis.speak(msg)
    }
    chekoutText();

    const goLogin = () => {
      this.zone.run(() => this.router.navigateByUrl('/login'))
      speechSynthesis.cancel();
    }

    const goProduct = () => {
      this.zone.run(() => this.router.navigateByUrl('/products'))
      speechSynthesis.cancel();
    }

     // TO ACTIVE KEY CONTROL
     let keyPressed = false;
    this.keyListen.onKeyPressed.subscribe((keyEvent: NgxKeyboardEvent) => {
      if(keyPressed === false && keyEvent.code === 17){
        speechSynthesis.cancel();
        recognition.start();
        keyPressed = true;
        setTimeout(checkKeyPressed, 10000);
      }
    });

    function checkKeyPressed(){
      return keyPressed = false;
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
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
        let last = event.results.length - 1;
        let command = event.results[last][0].transcript;
        console.log(command);
        if(command.toLowerCase() === 'sign in'){
          goLogin();
        }else if(command.toLowerCase() === 'product'){
          goProduct();
        }else if(command.toLowerCase() === 'log out'){
          this.serve.signOut();
          goLogin();
        }
    };
    recognition.onspeechend = () => {
        recognition.stop();
    };
    recognition.onerror = (event) => {
      console.log(event.error);
    }

  }

}
