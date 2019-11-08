import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StoryblokService } from '../storyblok.service';
import { StoreService } from '../store.service';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {


  constructor(private zone: NgZone, private router: Router, private store: StoreService,
        private route: ActivatedRoute, private productData: StoryblokService) { }

  // recStart(event){
  //   //console.log('Hi');
  // };

  products: any = [];
  product: any = [];
  cartItem: any = [];
  textArr: any = [];

  ngOnInit() {
    const playAudio = () => {
      let audio = new Audio();
      audio.src = "./assets/bleep.wav";
      audio.load();
      audio.play();
    }
    
    /**
     * Get data from the Service
     * Data will stored in the products array.
     */
    this.productData.getStory('/', {version: 'draft', starts_with: 'men/'})
      .then(data => {
        this.products = data.stories;    
    });

    const productId = this.route.snapshot.params.id;
    this.productData.getStory(productId, {version: 'draft'})
    .then(data => {
      this.product = data.story.content;
      //this.cartItem = data.story;
      
      // TO NERRATE PRODUCT DETAILS
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
    
    const goProduct = () => {
      this.zone.run(() => this.router.navigateByUrl('/products'))
     // recognition.stop()
    }

    const goToCart = () => {
      this.zone.run(() => this.router.navigateByUrl('/cart'))
      speechSynthesis.cancel();
    }

     /**
      * Function to take voice command from user and if the command match 
      * with the title of the product, it will navigate to that details page. 
      * @param cmd Voice Command as String
      */
     const filterProduct = (cmd: string)=>{
      this.products.filter(product=>{     
         if(product.content.title.toLowerCase() == cmd.toLowerCase()){
           speechSynthesis.cancel();
           this.zone.run(() => this.router.navigate(['/products', product.id], { relativeTo: this.route }))
         };
       })
     }

     // SPEECH TO TEXT    
    const {webkitSpeechRecognition} : IWindow = <IWindow>window;
    const recognition = new webkitSpeechRecognition();
    var SpeechGrammarList = SpeechGrammarList || window['webkitSpeechGrammarList'];
    
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
        
        filterProduct(command); 
        if(command.toLowerCase() === 'product'){  
          speechSynthesis.cancel();
          goProduct();          
        }else if(command.toLowerCase() === 'bye'){ 
          speechSynthesis.cancel(); 
          addToCart();
          goToCart();      
        }            
    };


    var circle = document.getElementById("circle");
    function once() {
     // playAudio();
      recognition.start();
      circle.removeEventListener("click", once);
      //let clcikAgain = circle.addEventListener('click', once);
    }
    circle.addEventListener("click", once);
    setInterval(once, 10000)
    
    // this.recStart= (event) => {
    //   //recognition.start();
    //   goProduct();
    // }

    recognition.onspeechend = function() {
        recognition.stop();
    };
    recognition.onerror = function(event) {
      console.log(event.error);
    }   
    
    
   
  }




}
