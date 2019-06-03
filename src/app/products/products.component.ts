import { Component, OnInit, Input, NgZone, HostListener, Renderer2 } from '@angular/core';
import { NgxKeyboardEventsService, NgxKeyboardEvent } from 'ngx-keyboard-events';
import { ActivatedRoute } from '@angular/router';
import { StoryblokService } from '../storyblok.service';
import { Router } from '@angular/router';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  
  constructor(private route: ActivatedRoute, private productData: StoryblokService,  
              private zone: NgZone, private router: Router, private renderer: Renderer2,
              private keyListen: NgxKeyboardEventsService) { }

  @Input() input: string;

  products = [];

  textArr = [];

  selectArr = []; 

  ngOnInit() {

      // CMS DATA CONNECTION
      this.productData.getStory('/', {version: 'draft', starts_with: 'men/'})
      .then(data => {
        this.products = data.stories;

        this.products.forEach((product) => {
          this.textArr.push(`${product.content.title}, It's price ${product.content.price} SEK ... `);
        });

      });


      // TEXT TO SPEECH      
        const intro = `To listen available products, please press "P". ... ....
                       To select an item. ...
                       Press "Control", and then say the "Product Name". ...`
        const textSpeech = () => {
            const msg = new SpeechSynthesisUtterance();
            msg.rate = 0.4;
            msg.text  = intro;
            msg.lang = 'en-US';
            speechSynthesis.speak(msg);
        } 
        setTimeout(textSpeech, 500)
        // textSpeech();  
 
      const sayText = () => {
        const textSpeech = () => {
          const msg = new SpeechSynthesisUtterance();
          msg.text  = `${this.textArr}`;
          msg.lang = 'en-US';
          speechSynthesis.speak(msg);
        }
        setTimeout(textSpeech, 500)
      };
      // sayText();

      // FUNCTIONS TO NAVIGATE PAGES
      const goHome = () => {
        this.zone.run(() => this.router.navigateByUrl('/'))
        speechSynthesis.cancel();
      }
  
      const goToCart = () => {
        this.zone.run(() => this.router.navigateByUrl('/cart'))
        speechSynthesis.cancel();
      }

      const goLinen = () => {
        // ?? Needs to create a function to catch the Params Id
        // const productId = this.route.snapshot.params.id;
        this.zone.run(() => this.router.navigate(['/products', 989868], { relativeTo: this.route }))
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

      // KEYBOARD CONTROL
      this.keyListen.onKeyPressed.subscribe((keyEvent: NgxKeyboardEvent) => {
        console.log('key event', keyEvent);
        if(keyEvent.code == 17){
          recognition.start();
        }else if(keyEvent.code == 80) {
          sayText();
          speechSynthesis.cancel();
        }else if(keyEvent.code == 13){
          setTimeout(textSpeech, 200)
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
          //?? Needs to create a function to read the product title
          if(command.toLowerCase() === 'linen formal shirt'){          
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


  }


}