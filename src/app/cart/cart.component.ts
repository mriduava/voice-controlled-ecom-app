import { Component, OnInit, NgZone } from '@angular/core';
import { NgxKeyboardEventsService, NgxKeyboardEvent } from 'ngx-keyboard-events';
import { StoreService } from '../store.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  user: firebase.User

  cartData = [];

  textArr = [];

  constructor(private store: StoreService, private keyListen: NgxKeyboardEventsService,
               private zone: NgZone, private router: Router, public fAuth:AngularFireAuth,
               private serve: AuthService) {}

  ngOnInit() {
    // USER LOGIN INFO
    this.serve.loggedIn()
    .subscribe(user => {
      this.user = user;     
    });
    // localStorage.setItem('user', JSON.stringify(this.user));


    // GET DATA FROM STORE SERVICE
    this.cartData = this.store.cartData;
    // this.cartData.push(localStorage.getItem('products'))  

    this.cartData.forEach((item)=>{
      this.textArr.push(`${item.content.title}, it's price ${item.content.price} SEK per quantity. ...`)
    })

    // TEXT TO SPEECH
     const cartIntro = () => {
      const msg = new SpeechSynthesisUtterance();
      msg.text = `You have just bought, ${((this.cartData)[(this.cartData).length - 1]).content.title}. ....
                  There are ${(this.cartData).length} Products in your cartlist...
                  Products in your Shopping Cart. ....`  
      speechSynthesis.speak(msg)
     }

      const textMore = () => {
        const msg = new SpeechSynthesisUtterance();    
        msg.text = `To buy more products. ...
                    Press "Control", and say "Continue". ...
                    To Remove an item. ...
                    Press "Control" and say "Remove" and the "Product name". ...
                    To go to Chekout. ...
                    Press "Control" and say "Checkout. ..."`
        speechSynthesis.speak(msg)
      }
      
      const textSpeech = () => {
        const speaks = [{name: 'Alex', lang: 'en-US'}];
        const msg = new SpeechSynthesisUtterance();
        msg.volume = 1;
        msg.rate = 1;
        msg.pitch = 1.5;
        msg.text  = `${this.textArr}`;
        const voice = speaks[0];
        msg.lang = voice.lang;
        if(this.cartData.length>0){
          cartIntro();
          speechSynthesis.speak(msg);
          textMore();
        }else{
          const sorrymsg = new SpeechSynthesisUtterance();
          sorrymsg.text = `Sorry!! ... Your shopping cart is empty. ...
                           To buy a product. ...
                           Please press "Control" and then say "Continue". ...`
          speechSynthesis.speak(sorrymsg);
        }

      };
      setTimeout(textSpeech, 1000);
      
      // VOICE AFTER REMOVE ITEM
      const cartRemove = () => {
        const msg = new SpeechSynthesisUtterance();
        msg.text = `There are ${(this.cartData).length} Products in your cartlist...
                    Products in your Shopping Cart. ....`  
        speechSynthesis.speak(msg)
       }

      const removeSpeech = () => {
        const msg = new SpeechSynthesisUtterance();
        msg.text  = `${this.textArr}`;
        if(this.cartData.length>0){
          cartRemove();
          speechSynthesis.speak(msg);
          textMore();
        }else{
          const sorrymsg = new SpeechSynthesisUtterance();
          sorrymsg.text = `Sorry!! ... Your shopping cart is empty. ...
                           To buy a product. ...
                           Please press "Control" and then say "Continue". ...`
          speechSynthesis.speak(sorrymsg);
        }

      };

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

    const playAudio = () => {
      let audio = new Audio();
      audio.src = "./assets/bleep.wav";
      audio.load();
      audio.volume = 0.1;
      audio.play();
    }
    // KEYBOARD EVENT
    let keyPressed = false;
    this.keyListen.onKeyPressed.subscribe((keyEvent: NgxKeyboardEvent) => {
      if(keyPressed === false && keyEvent.code === 17){
        speechSynthesis.cancel();
        recognition.start();
        playAudio();
        keyPressed = true;
        setTimeout(checkKeyPressed, 10000);
      }
    });

    function checkKeyPressed(){
      return keyPressed = false;
    }

    const removeProduct = (cmd: string)=>{
      this.cartData.forEach((product, i)=>{ 
        let title = `remove ${product.content.title.toLowerCase()}`    
         if(title === cmd.toLowerCase()){
           this.cartData.splice(i, 1)  
           this.zone.run(() => this.router.navigateByUrl('/cart')) 
              const msg = new SpeechSynthesisUtterance();    
              msg.text = `${product.content.title}, has been removed. ...`
              speechSynthesis.speak(msg)  
           removeSpeech();      
         };
       })
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
        removeProduct(command)
        if(command.toLowerCase() === 'continue'){
          goToPro();
        }else if(command.toLowerCase() === 'check out'){
            if(!this.user){
              goLogin();
            }else{
              goCheckout();              
            }
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
