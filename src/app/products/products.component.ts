import { Component, OnInit, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { NgxKeyboardEventsService, NgxKeyboardEvent } from 'ngx-keyboard-events';
import { ActivatedRoute } from '@angular/router';
import { StoryblokService } from '../storyblok.service';
import { Observable, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
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
  disppro: Observable<any>[];
  
  constructor(private route: ActivatedRoute, private productData: StoryblokService,  
              private zone: NgZone, private router: Router, 
              private keyListen: NgxKeyboardEventsService, private changeDetector: ChangeDetectorRef) {

                this.products.title=['Linen Formal Shirt']
                
               }

  @Input() input: string;

  products: any = [];

  textArr = [];

  selectArr = []; 
  
  // OPTIONAL ARRT FOR TEST
  showArr = [];

  ngOnInit() {
      // CMS DATA CONNECTION
      this.productData.getStory('/', {version: 'draft', starts_with: 'men/'})
      .then(data => {
        this.products = data.stories;    

        this.products.forEach((product) => {
          this.textArr.push(`${product.content.title}, It's price ${product.content.price} SEK ... `);
          this.showArr.push(`${product.content.title}`);
        });
        console.log(this.showArr);
      });

      // TEXT TO SPEECH      
        const intro = `To listen available products, please press "P". ... ....
                       To select an item. ...
                       Press "Control", and then say the "Product Name". ...`
        const textSpeech = () => {
            const msg = new SpeechSynthesisUtterance();
            msg.rate = 0.6;
            msg.text  = intro;
            msg.lang = 'en-US';
            speechSynthesis.speak(msg);
        } 
        setTimeout(textSpeech, 500)
 
      const sayText = () => {
        const textSpeech = () => {
          const msg = new SpeechSynthesisUtterance();
          msg.text  = `${this.textArr}`;
          msg.lang = 'en-US';
          speechSynthesis.speak(msg);
        }
        setTimeout(textSpeech, 500)
      };
  

      // FUNCTIONS TO NAVIGATE PAGES
      const goHome = () => {
        this.zone.run(() => this.router.navigateByUrl('/'))
        recognition.stop()
      }
  
      const goToCart = () => {
        this.zone.run(() => this.router.navigateByUrl('/cart'))
        recognition.stop()
      }

      const goLinen = () => {
        // ?? Need to create a function to get the Product ID or Params
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
        if(keyEvent.code === 17){
          recognition.start();
          speechSynthesis.cancel();
        }else if(keyEvent.code === 80) {
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
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = function(event) {
          let last = event.results.length - 1;
          let command = event.results[last][0].transcript;
          console.log(command);     
          //?? NEED TO MAKE IT DYNAMIC
          //?? Need to create a function to read the product title

          // const getProduct = (title) => {
          //   var product = this.products.filter((item) => {
          //       return item.title == title;
          //   });        
          //   return product;  
          // }
          // getProduct('linen formal shirt')

          // const getProduct = (title) => {        
          //       return title == 'linen formal shirt';      
          // }
          // var product = this.products.filter(getProduct)
          // console.log(product);
          

      

          // if(command.toLowerCase() == `${this.showArr[0]}`){
          //   console.log(`Hi, I am `);                      
          // }
      
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
  
  filter(title){


  }



}