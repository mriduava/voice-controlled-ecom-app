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

    const playAudio = () => {
      let audio = new Audio();
      audio.src = "./assets/welcome.wav";
      audio.load();
      audio.play();
    }
    playAudio();

    // TEXT TO SPEECH      
    const intro = `Supernova. ... ....
                   Online Shop for Visually impaired person. ... ...
                   To go to see Products. ...
                   Press "Control", and then say "Product". ...`
    const textSpeech = () => {
    const msg = new SpeechSynthesisUtterance();
    msg.rate = 0.6;
    msg.text  = intro;
    msg.lang = 'en-US';
    speechSynthesis.speak(msg);
    } 
    setTimeout(textSpeech, 7000)

    // FUNCTIONS TO NAVIGATE PAGES
    const goProduct = () => {
      this.zone.run(() => this.router.navigateByUrl('/products'))
      recognition.stop()
    }

    
    // KEYBOARD CONTROL
    this.keyListen.onKeyPressed.subscribe((keyEvent: NgxKeyboardEvent) => {
      if(keyEvent.code === 17){
        recognition.start();
        // setTimeout(textSpeech, 7000)
      }else if(keyEvent.code === 80) {
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

         if(command.toLowerCase() === 'product'){  
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
