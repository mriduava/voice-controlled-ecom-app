import { Component, OnInit, NgZone } from '@angular/core';
import { NgxKeyboardEventsService, NgxKeyboardEvent } from 'ngx-keyboard-events';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { StoryblokService } from '../storyblok.service';
import { StoreService } from '../store.service';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {

  product: any = [];

  cartItem: any = [];

  textArr = [];

  constructor(private route: ActivatedRoute, private showItem: StoryblokService, private router: Router, 
              private zone: NgZone, private keyListen: NgxKeyboardEventsService, private store: StoreService) { }

  ngOnInit() {
    const productId = this.route.snapshot.params.id;
    this.showItem.getStory(productId, {version: 'draft'})
    .then(data => {
      console.log(data.story);
      this.product = data.story.content;
      this.cartItem = data.story;

      this.textArr.push(`${this.product.title} has been selected, 
                         ${this.product.summary} ...
                         It's price ${this.product.price} SEK ... ...
                         To Buy the Product,
                         Please press "Control", and then say "Buy". ... ...
                         To go to Product page,
                         Please press "Control", and then say "Continue". ... ...`);
    });

    // ADD TO CART
    const addToCart = () => {
      this.store.cartData.push(this.cartItem);
      localStorage.setItem('products', JSON.stringify(this.cartItem))
    }

    // TEXT TO SPEECH
    const sayText = () => {
        const textSpeech = () => {
          const speaks = [{name: 'Alex', lang: 'en-US'}];
          const msg = new SpeechSynthesisUtterance();
          msg.volume = 1;
          msg.rate = 1;
          msg.pitch = 1.5;
          msg.text  = `${this.textArr}`;
          const voice = speaks[0];
          msg.lang = voice.lang;
          speechSynthesis.speak(msg);
        };
        setTimeout(textSpeech, 2000);
      };
    sayText();

    
    const goToPro = () => {
      this.zone.run(() => this.router.navigateByUrl('/products'))
      speechSynthesis.cancel();
    }

    const goToCart = () => {
      this.zone.run(() => this.router.navigateByUrl('/cart'))
      speechSynthesis.cancel();
    }

    this.keyListen.onKeyPressed.subscribe((keyEvent: NgxKeyboardEvent) => {
      if(keyEvent.code == 17){
        recognition.start();
      }else if(keyEvent.code == 80) {
        sayText();
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
        }else if(command.toLowerCase() === 'bye'){  
          addToCart();
          goToCart();
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


