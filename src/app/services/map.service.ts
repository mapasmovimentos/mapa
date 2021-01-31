import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { MarkerObject } from '../models/marker-object.interface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MapService {

  constructor(private http: HttpClient) {

  }

  baseUrl: string = 'https://joilsonmarques.wixsite.com/mysite/_functions-dev/api/';

  getWixPins() {
    return this.http.get(this.baseUrl+'Pins');
  }

  getMapConfig() {
    return this.http.get(this.baseUrl+'Config');
  }

}