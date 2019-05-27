import { Injectable } from '@angular/core';
import Client from 'storyblok-js-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StoryblokService {

  private sbClient = new Client({
    accessToken: 'vzwC59CqmD9irvJTGSQVKAtt'
  });

  constructor(private dataConnect: HttpClient) { }

  getStory(slug: string, params?: object): Promise<any> {
    return this.sbClient.getStory(slug, params)
      .then(res => res.data);      
  }

  getStories(params?: object): Promise<any> {
    return this.sbClient.getStories(params)
      .then(res => res.data);
  }

  // getMusic(artist: string) {
  //   let token = 'vzwC59CqmD9irvJTGSQVKAtt'
  //   return this.dataConnect.get(`https://api.storyblok.com/v1/cdn/stories?version=draft&token=${token}&starts_with=women`)
  // }


}
