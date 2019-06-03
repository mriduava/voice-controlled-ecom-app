import { Component, OnInit, NgZone } from '@angular/core';
import { NgxKeyboardEventsService, NgxKeyboardEvent } from 'ngx-keyboard-events';
import { StoreService } from '../store.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  user: Observable<firebase.User>;

  cartData= [];

  constructor(private store: StoreService, private keyListen: NgxKeyboardEventsService, 
               private zone: NgZone, private router: Router, public fAuth:AngularFireAuth) { 
                this.user=this.fAuth.authState;
               }


  ngOnInit() {
    this.cartData = this.store.cartData;
    console.log(this.cartData);

    // TEXT TO SPEECH  
      const textSpeech = () => {
        const speaks = [{name: 'Alex', lang: 'en-US'}];
        const msg = new SpeechSynthesisUtterance();
        msg.volume = 1;
        msg.rate = 1;
        msg.pitch = 1.5;
        msg.text  = `${this.cartData}`;
        const voice = speaks[0];
        msg.lang = voice.lang;
        speechSynthesis.speak(msg);
      };
      setTimeout(textSpeech, 2000);
    
    // FUNCTIONS TO NAVIGATE
    const goToPro = () => {
      this.zone.run(() => this.router.navigateByUrl('/products'))
      speechSynthesis.cancel();
    }

    const goCheckout = () => {
      this.zone.run(() => this.router.navigateByUrl('/cart/checkout'))
      speechSynthesis.cancel();
    }

    const goLogin = () => {
      this.zone.run(() => this.router.navigateByUrl('/login'))
      speechSynthesis.cancel();
    }
     
    // TO ACTIVE KEY CONTROL
    this.keyListen.onKeyPressed.subscribe((keyEvent: NgxKeyboardEvent) => {
      if(keyEvent.code == 17){
        recognition.start();
      }else if(keyEvent.code == 80) {
        // sayText();
        speechSynthesis.cancel();
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
    // recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = function(event) {
        let last = event.results.length - 1;
        let command = event.results[last][0].transcript;        
        console.log(command);    
        if(command.toLowerCase() === 'continue'){          
          goToPro();
        }else if(command.toLowerCase() === 'check out'){ 
            if(this.user){          
              goCheckout();
            }else{
              goLogin();
            }          
        }      
    };
    recognition.onspeechend = function() {
        recognition.stop();
    };
    recognition.onerror = function(event) {
      console.log(event.error);
    }  
    
  }

}
