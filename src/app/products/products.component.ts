import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor() { }

  @Input() input: string;

  speaks = [
    {
      name: 'Alva',
      lang: 'sv-SE'
    },
    {
      name: 'Alice',
      lang: 'it-IT'
    },
    {
      "name": "Alva",
      "lang": "sv-SE"
    }
  ];

  products = [
    { title: 'Orange Top' , price: 349, id: 1},
    { title: 'Gray Shirt', price: 239, id: 2},
    { title: 'Tarkish Blouse', price: 450, id: 3}
  ];

  msg = new SpeechSynthesisUtterance();



  ngOnInit() {
      this.msg.volume = 1; // 0 to 1
      this.msg.rate = 1; // 0.1 to 10
      this.msg.pitch = 1; // 0 to 2
      this.msg.text  = `Available Products
                  ${this.products[0].title}, It's price ${this.products[0].price} SEK
                  ${this.products[1].title}, It's price ${this.products[1].price} SEK
                  ${this.products[2].title}, It's price ${this.products[2].price} SEK`
      // msg.text  = speakText;

      const voice = this.speaks[0]; //47
      console.log(`Voice: ${voice.name} and Lang: ${voice.lang}`);
      this.msg.voiceURI = voice.name;
      this.msg.lang = voice.lang;
      speechSynthesis.speak(this.msg);
  }




}
