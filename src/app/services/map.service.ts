import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MapService {

  constructor(private http: HttpClient) {

  }

  baseUrl: string = 'https://www.mapasmovimentos.com/_functions/api/Pins';

  getWixPins() {
    return this.http.get(this.baseUrl+'Pins');
  }

  getMapConfig() {
    return this.http.get(this.baseUrl+'mapconfig');
  }

}
