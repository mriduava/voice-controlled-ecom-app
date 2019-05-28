import { Injectable } from '@angular/core';
import Client from 'storyblok-js-client';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StoryblokService {

  private sbClient = new Client({
    accessToken: 'vzwC59CqmD9irvJTGSQVKAtt'
  });

  constructor(private dataConnect: HttpClient, private route: ActivatedRoute) { }

  getStory(slug: string, params?: object): Promise<any> {
    return this.sbClient.getStory(slug, params)
      .then(res => res.data);
  }

}
