import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryblokService } from '../storyblok.service';
import {Router} from '@angular/router';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private productData: StoryblokService,  private zone: NgZone, private router: Router) { }

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

        
      // for(let product of this.products){
      //   this.selectArr.push(product.content.title)
      // }

      });


      // TEXT TO SPEECH
      const sayText = () => {
        const textSpeech = () => {
          const msg = new SpeechSynthesisUtterance();
          msg.volume = 1;
          msg.rate = 1;
          msg.pitch = 1.5;
          msg.text  = `${this.textArr}`;
          const voice = this.speaks[0];
          msg.lang = voice.lang;
          speechSynthesis.speak(msg);
        }
        setTimeout(textSpeech, 3000)
      };
      // sayText();

      
      // document.querySelector('#btnGiveCommand').addEventListener('click', function(){
      //     recognition.start();
      // });

      const goLinen = () => {
        // const productId = this.route.snapshot.params.id;
        this.zone.run(() => this.router.navigate(['/products', 989868], { relativeTo: this.route }))
        speechSynthesis.cancel();
      }
  
      const goToCart = () => {
        this.zone.run(() => this.router.navigateByUrl('/cart'))
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
      
           

            // if(command.toLowerCase() === `linen formal shirt`){          
            //   console.log(this.products);
            //   // goToPro();
            // }else if(command.toLowerCase() === 'bye'){  
            //   goToCart();
            // }

            // let obj = this.products.find((o, i) =>{
            //   if((o.title).toLowerCase() === command.toLowerCase()){
            //     console.log(obj);
            //   }
            // })
         
         


          if(command.toLowerCase() === 'linen formal shirt'){          
            // console.log('I am listening');
            goLinen();
          }else if(command.toLowerCase() === 'blue formal shirt'){  
            goBlue();
          }else if(command.toLowerCase() === 'black collar t-shirt'){  
            goBlack();
          }else if(command.toLowerCase() === 'black white t-shirt'){  
            goBlackWhite();
          }
        
      };
      recognition.onspeechend = function() {
          recognition.stop();
      };
      recognition.onerror = function(event) {
        console.log(event.error);
      }        
      document.querySelector('#speak').addEventListener('click', function(){
          recognition.start();
      });




  }

}
