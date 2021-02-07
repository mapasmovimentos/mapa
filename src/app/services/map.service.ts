import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MapService {

  constructor(private http: HttpClient) {

  }

  baseUrl: string = 'https://gabrieltramos0.wixsite.com/website/_functions/api/';

  getWixPins() {
    return this.http.get(this.baseUrl+'Pins');
  }
}
