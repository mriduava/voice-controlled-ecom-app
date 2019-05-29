import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryblokService } from '../storyblok.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private productData: StoryblokService) { }

  @Input() input: string;

  speaks = [
    {name: 'Alex', lang: 'en-US'},
    {name: 'Alice', lang: 'it-IT'},
    {name: 'Alva', lang: 'sv-SE'}
  ];

  products = [];

  textArr = [];

  // SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

  ngOnInit() {

      // CMS DATA CONNECTION
      this.productData.getStory('/', {version: 'draft', starts_with: 'women/'})
      .then(data => {
        this.products = data.stories;

        this.products.forEach((product) => {
          this.textArr.push(`${product.content.title}, It's price ${product.content.price} SEK ... `);
        });

      });

      // TEXT TO SPEECH
      const sayText = () => {
        const textSpeech = () => {
          const msg = new SpeechSynthesisUtterance();
          msg.volume = 1;
          msg.rate = 1;
          msg.pitch = 1.5;
          msg.text  = `${this.textArr}`;
          const voice = this.speaks[0];
          msg.lang = voice.lang;
          speechSynthesis.speak(msg);
        }
        setTimeout(textSpeech, 3000)
      };
      // sayText();

      
      // document.querySelector('#btnGiveCommand').addEventListener('click', function(){
      //     recognition.start();
      // });




  }

}
