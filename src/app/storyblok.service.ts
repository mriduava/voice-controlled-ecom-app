import { Injectable } from '@angular/core';
import Client from 'storyblok-js-client';

@Injectable({
  providedIn: 'root'
})

export class StoryblokService {

  private sbClient = new Client({
    accessToken: 'lWJ1SBQBBo9qsPQFHmG3RQtt'
  });

  constructor() { }

  getStory(slug: string, params?: object): Promise<any> {
    return this.sbClient.getStory(slug, params)
      .then(res => res.data);
  }

}
