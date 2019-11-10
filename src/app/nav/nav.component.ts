import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';


export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {


  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {

    // var circle = document.getElementById("circle");
    // function once() {
    //  // playAudio();
    //   recognition.start();
    //   circle.removeEventListener("click", once);
    // }
    // circle.addEventListener("click", once);
   // setInterval(once, 10000)
    
  
   
  }




}
