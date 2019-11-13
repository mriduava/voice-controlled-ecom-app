import { Component, OnInit, NgZone} from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {


  constructor(private zone: NgZone, private router: Router) { }

  ngOnInit() {

    const goProduct = () => {
      this.zone.run(() => this.router.navigateByUrl('/products'));
      speechSynthesis.cancel();
    }

    var circle = document.getElementById("circle");
    function once() {
      const msg = new SpeechSynthesisUtterance();
      msg.text = "";
      speechSynthesis.speak(msg);  
      goProduct();   
     // circle.removeEventListener("click", once);
    }
    circle.addEventListener("click", once);

  }


}
