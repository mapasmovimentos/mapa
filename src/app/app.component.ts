import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';
import {Component, OnInit, ViewChild, Injectable} from '@angular/core';
import {MapInfoWindow, MapMarker, GoogleMap} from '@angular/google-maps';
import {YouTubePlayer} from '@angular/youtube-player';
import { MarkerObject } from './models/marker-object.interface';
import { MapService } from './services/map.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class AppComponent implements OnInit {

  constructor(private mapService: MapService){

  }

  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild(GoogleMap) map!: GoogleMap;

  videoId: string | null = null;
  html: string | null = null;
  cover: string | null = null;
  pins: {} | null = null;
  shown: string = "off";

  @ViewChild(YouTubePlayer) youtubePlayer!: YouTubePlayer;

  markers: MarkerObject[] = [];

  info: string | null = null;
  center = {lat: -15.7904734, lng: -47.9441261};
  zoom = 4;

  options = {
    mapId: '9488821ae52526f5',
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false
  } as google.maps.MapOptions


  ngOnInit(): void {
      let obj: any;

      this.mapService.getWixPins().subscribe(
        pins => {
          pins.items.map( item => {
            item.option = {title: item.title, position: {lat: item.lat, lng: item.lng}};
            item.info = item.title;
            item.cover = this.getFullImageURL(item.cover);
            item.showPin = item.title && item.lat && item.lng;
          });
          this.markers = pins.items.filter(item => {
            return item.showPin;
          });
        },
        err => {
          console.log("erro:", err);
        }
      )

      // obj.items.forEach((element: any) => {
      //   if(element.cover){
      //     element.cover = this.getFullImageURL(element.cover);
      //   }
      //   this.markers.push({
      //     option: {title: element.title, position: {lat: element.lat, lng: element.lng}},
      //     videoId: element.videoId,
      //     info: element.title,
      //     html: element.info,
      //     cover: element.cover
      //   });

      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
  }

  getFullImageURL(imageSRC: string) {
    let strReturnImage = "";
    if(imageSRC && imageSRC.startsWith("wix:image:")) {
      let wixImageURL = "";
          wixImageURL = "https://static.wixstatic.com/media/";
      let wixLocalURL = "";
          wixLocalURL = imageSRC.replace('wix:image://v1/', '');
          wixLocalURL = wixLocalURL.substr(0, wixLocalURL.lastIndexOf('/'));
          strReturnImage = wixImageURL + wixLocalURL;
      } else {
        strReturnImage = imageSRC;
      }
    return strReturnImage;
  }

  slideOut(): void{
    this.shown = "off";
    this.infoWindow.close();
  }

  openInfoWindow(markerElement: MapMarker, marker: MarkerObject): void {
    if (this.youtubePlayer
      && this.youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      this.youtubePlayer.stopVideo();
    }

    this.videoId = marker.videoId;
    this.info = marker.info;
    this.html = marker.html;
    this.cover = marker.cover;
    this.shown = "on";

    this.infoWindow.open(markerElement);
  }

  onReady(event: YT.PlayerEvent): void {
    event.target.playVideo();
  }

  onStateChange(event: YT.OnStateChangeEvent): void {
    if (event.data === YT.PlayerState.CUED) {
      event.target.playVideo();
    }
  }

}




