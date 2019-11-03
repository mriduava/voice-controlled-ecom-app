import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;

  recStart(event);
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {


  constructor(private zone: NgZone, private router: Router) { }

  recStart(event){
    //console.log('Hi');
  };

  

  ngOnInit() {
    
    const goProduct = () => {
      this.zone.run(() => this.router.navigateByUrl('/products'))
      recognition.stop()
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
    recognition.onresult = function(event) {
        let last = event.results.length - 1;
        let command = event.results[last][0].transcript;
        console.log(command);   
        if(command.toLowerCase() === 'product'){  
          goProduct();
        }            
    };

    this.recStart= (event) => {
      recognition.start();
    }
    recognition.onspeechend = function() {
        recognition.stop();
    };
    recognition.onerror = function(event) {
      console.log(event.error);
    }   
    
    
   
  }




}
