import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const chekoutText = () => {
      const msg = new SpeechSynthesisUtterance();    
      msg.text = `Your Product is going to deliver to this Address. ...`
      speechSynthesis.speak(msg)
    }
    chekoutText();

  }

}
