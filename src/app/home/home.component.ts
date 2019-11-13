import { Component, OnInit, NgZone } from '@angular/core';
import { NgxKeyboardEventsService, NgxKeyboardEvent } from 'ngx-keyboard-events';
import { Router } from '@angular/router';


export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor( private zone: NgZone, private keyListen: NgxKeyboardEventsService, private router: Router) { }

  ngOnInit() {
    var cnt = document.getElementById("cnt");
    function once() {
      recognition.start();
      const msg = new SpeechSynthesisUtterance();
      msg.text = "";
      speechSynthesis.speak(msg);  
      recognition.stop();   
      cnt.removeEventListener("click", once);
    }
    cnt.addEventListener("click", once);


    // TEXT TO SPEECH      
    const intro = `Supernova. ... ....
                   Online Shop for Visually impaired person. ... ...
                   To go to see Products. ...
                   Press "Control", and then say "Product". ...`;

    const textSpeech = (text) => {
      const msg = new SpeechSynthesisUtterance();
      msg.rate = 0.6;
      msg.text  = text;
      msg.lang = 'en-US';
      speechSynthesis.speak(msg);
    }

    // function clickOneTime(){ 
    //   let text = "";      
    //   textSpeech(text);  
    //   console.log("Clicked Window!")
    //   cont.removeEventListener('click', clickOneTime);
    // }
    // cont.addEventListener('click', clickOneTime);

    //textSpeech(intro);
    let counter = 0;
    function runThreeTimes(){
      if(counter<3){
        textSpeech(intro);
        counter++;
        setTimeout(runThreeTimes, 50000);
      }
    }
    runThreeTimes();

    const playAudio = () => {
      let audio = new Audio();
      audio.src = "./assets/bleep.wav";
      audio.load();
      audio.volume = 0.1;
      audio.play();
    }

    // FUNCTIONS TO NAVIGATE PAGES
    const goProduct = () => {
      this.zone.run(() => this.router.navigateByUrl('/products'))
    }

    
    // KEYBOARD CONTROL
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

         if(command.toLowerCase() === 'product'){  
           speechSynthesis.cancel();
           recognition.stop()
           keyPressed = true;
           goProduct();
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
