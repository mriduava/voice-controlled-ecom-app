import { Component, OnInit, Input, NgZone, HostListener, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryblokService } from '../storyblok.service';
import {Router} from '@angular/router';
import { NgxKeyboardEventsService, NgxKeyboardEvent } from 'ngx-keyboard-events';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
export enum KEY_CODE {
  S_KEY = 83,
  P_KEY = 80
}



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  private speechText2: Function;

  

  constructor(private route: ActivatedRoute, private productData: StoryblokService,  
              private zone: NgZone, private router: Router, private renderer: Renderer2,
              private keyListen: NgxKeyboardEventsService) { }

  @Input() input: string;

  speaks = [
    {name: 'Alex', lang: 'en-US'},
    {name: 'Alice', lang: 'it-IT'},
    {name: 'Alva', lang: 'sv-SE'}
  ];

  products = [];

  textArr = [];

  selectArr = []; 

  ngOnInit() {

      // CMS DATA CONNECTION
      this.productData.getStory('/', {version: 'draft', starts_with: 'men/'})
      .then(data => {
        this.products = data.stories;

        this.products.forEach((product) => {
          // var productId = product.id;
          this.textArr.push(`${product.content.title}, It's price ${product.content.price} SEK ... `);
        });

      });


      // TEXT TO SPEECH      
      const sayIntro = () => {
        const intro = `To listen available products, please press "P". ... ....
                       To select an item. ...
                       Press "S", and then say the "Product Name". ...`
        const textSpeech = () => {
          const msg = new SpeechSynthesisUtterance();
          msg.rate = 0.4;
          msg.text  = intro;
          msg.lang = 'en-US';
          speechSynthesis.speak(msg);
        }
        setInterval(textSpeech, 50000)
      };
      // sayIntro();

      // const sayText = () => {
      //   const textSpeech = () => {
      //     const msg = new SpeechSynthesisUtterance();
      //     // msg.volume = 1;
      //     // msg.rate = 1;
      //     // msg.pitch = 1.5;
      //     msg.text  = `${this.textArr}`;
      //     // const voice = this.speaks[0];
      //     // msg.lang = voice.lang;
      //     msg.lang = 'en-US';
      //     speechSynthesis.speak(msg);
      //   }
      //   setTimeout(textSpeech, 3000)
      // };
      // sayText();






      const goLinen = () => {
        // const productId = this.route.snapshot.params.id;
        this.zone.run(() => this.router.navigate(['/products', 989868], { relativeTo: this.route }))
        speechSynthesis.cancel();
      }
  
      const goToCart = () => {
        this.zone.run(() => this.router.navigateByUrl('/cart'))
        speechSynthesis.cancel();
      }

      const goHome = () => {
        this.zone.run(() => this.router.navigateByUrl('/'))
        speechSynthesis.cancel();
      }

      const goBlue = () => {
        this.zone.run(() => this.router.navigate(['/products', 989866], { relativeTo: this.route }))
        speechSynthesis.cancel();
      }

      const goBlack = () => {
        this.zone.run(() => this.router.navigate(['/products', 989820], { relativeTo: this.route }))
        speechSynthesis.cancel();
      }

      const goBlackWhite = () => {
        this.zone.run(() => this.router.navigate(['/products', 989818], { relativeTo: this.route }))
        speechSynthesis.cancel();
      }

      this.keyListen.onKeyPressed.subscribe((keyEvent: NgxKeyboardEvent) => {
        console.log('key event', keyEvent);
        if(keyEvent.code == 83){
          console.log('hi i m Ss');
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
          // recognition.continuous = true;
          recognition.interimResults = false;
          recognition.onresult = function(event) {
              let last = event.results.length - 1;
              let command = event.results[last][0].transcript;
              
              console.log(command);     
              
              if(command.toLowerCase() === 'linen formal shirt'){          
                // console.log('I am listening');
                goLinen();
              }else if(command.toLowerCase() === 'blue formal shirt'){  
                goBlue();
              }else if(command.toLowerCase() === 'black collar t-shirt'){  
                goBlack();
              }else if(command.toLowerCase() === 'black white t-shirt'){  
                goBlackWhite();
              }else if(command.toLowerCase() === 'cart'){  
                goToCart();
              }else if(command.toLowerCase() === 'home'){  
                goHome();
              }
            
          };
          recognition.onspeechend = function() {
              recognition.stop();
          };
          recognition.onerror = function(event) {
            console.log(event.error);
          }        
          // document.querySelector('#speak').addEventListener('click', function(){
          //     recognition.start();
          // });

  }

  sayText = () => {
      const msg = new SpeechSynthesisUtterance();
      msg.text  = `${this.textArr}`;
      msg.lang = 'en-US';
      speechSynthesis.speak(msg);
  };

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log(event);
    if (event.keyCode === KEY_CODE.P_KEY) {
      this.sayText();
    }
    // else if (event.keyCode === KEY_CODE.P_KEY) {
    //   this.speechText();
    // }
  }


  

}
