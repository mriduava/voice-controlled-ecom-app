import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryblokService } from '../storyblok.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  product = [];

  textArr = [];

  constructor(private route: ActivatedRoute, private showItem: StoryblokService) { }

  ngOnInit() {
    const productId = this.route.snapshot.params.id;
    this.showItem.getStory(productId, {version: 'draft'})
    .then(data => {
      console.log(data.story);
      this.product = data.story.content;

      this.textArr.push(`${this.product.title} has been selected, It's price ${this.product.price} SEK ... `);
      console.log(this.textArr);



    });

      // TEXT TO SPEECH
    const sayText = () => {
        const textSpeech = () => {
          const speaks = [{name: 'Alex', lang: 'en-US'}];
          const msg = new SpeechSynthesisUtterance();
          msg.volume = 1;
          msg.rate = 1;
          msg.pitch = 1.5;
          msg.text  = `${this.textArr}`;
          const voice = speaks[0];
          msg.lang = voice.lang;
          speechSynthesis.speak(msg);
        };
        setTimeout(textSpeech, 3000);
      };
    sayText();

  }



}
