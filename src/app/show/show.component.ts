import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryblokService } from '../storyblok.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  showMore = [];

  constructor(private route: ActivatedRoute, private showItem: StoryblokService) { }

  ngOnInit() {
    const productId = this.route.snapshot.params['id'];
    this.showItem.getStory(productId, {version: 'draft'})
    .then(data => {
      console.log(data);
      this.showMore = data.stories;
    });

  }



}
