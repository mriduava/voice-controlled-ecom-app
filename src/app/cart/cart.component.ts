import { Component, OnInit, NgZone } from '@angular/core';
import { NgxKeyboardEventsService, NgxKeyboardEvent } from 'ngx-keyboard-events';
import { StoreService } from '../store.service';
import {Router} from '@angular/router';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartData: any = [];

  constructor(private store: StoreService, private keyListen: NgxKeyboardEventsService, private zone: NgZone, private router: Router) { }

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
      this.zone.run(() => this.router.navigateByUrl('/checkout'))
      speechSynthesis.cancel();
    }
     
    // TO ACTIVE KEY CONTROL
    this.keyListen.onKeyPressed.subscribe((keyEvent: NgxKeyboardEvent) => {
      console.log('key event', keyEvent);
      if(keyEvent.code == 83){
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
        }else if(command.toLowerCase() === 'checkout'){  
          goCheckout();
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
