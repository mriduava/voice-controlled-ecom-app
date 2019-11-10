import { Component, OnInit, ChangeDetectorRef} from '@angular/core';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {


  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {

    var circle = document.getElementById("circle");
    function once() {
      const msg = new SpeechSynthesisUtterance();
      msg.text = "";
      speechSynthesis.speak(msg);     
      circle.removeEventListener("click", once);
    }
    circle.addEventListener("click", once);
  }


}
