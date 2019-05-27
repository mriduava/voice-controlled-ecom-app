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
    {
      "name": "Alex",
      "lang": "en-US"
    },
    {
      "name": "Alice",
      "lang": "it-IT"
    },
    {
      "name": "Alva",
      "lang": "sv-SE"
    }
]

  products = [
    // {
    //   content: { title: 'Orange Top' , price: 349, id: 1}
    // },
    // {
    //   content: { title: 'Gray Shirt', price: 239, id: 2}
    // },
    // {
    //   content: { title: 'Tarkish Blouse', price: 450, id: 3}
    // }
  ];

  textArr = [];

  speakText = this.products.forEach((product)=>{
    this.textArr.push(`${product.content.title}, It's price ${product.content.price} SEK ... `)
  });

  // spekText: any;
 
  ngOnInit() {
      
      // DATA COMING FROM CMS
      
      this.productData.getStory('/', {version: 'draft', starts_with: 'women/'})
      .then(data => {
        this.products = data.stories

        this.products.forEach((product)=>{
          this.textArr.push(`${product.content.title}, It's price ${product.content.price} SEK ... `)
        });
        
      }); 
      
      
            // let textArr = [];
      // TEXT TO SPEECH
      setTimeout(()=>{

     
      const msg = new SpeechSynthesisUtterance();
          msg.volume = 1; // 0 to 1
          msg.rate = 1; // 0.1 to 10
          msg.pitch = 1; // 0 to 2
          // this.msg.text  = `Available Products
          //             ${this.products[0].title}, It's price ${this.products[0].price} SEK
          //             ${this.products[1].title}, It's price ${this.products[1].price} SEK
          //             ${this.products[2].title}, It's price ${this.products[2].price} SEK`
          
          msg.text  = this.textArr;
          const voice = this.speaks[0]; //47
          // console.log(`Voice: ${voice.name} and Lang: ${voice.lang}`);
          // msg.voiceURI = voice.name;
          msg.lang = voice.lang;
          speechSynthesis.speak(msg);
      }, 3000)

      console.log(this.textArr);

      // for(let product of this.products){
      //    this.textArr.push(product.content.title)
      // }



  }

}
