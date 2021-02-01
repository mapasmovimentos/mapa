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

  constructor(private mapService: MapService){}

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

    this.mapService.getWixPins().subscribe(
          (pins:any) => {
          pins.items.map( (item: any) => {
            item.option = {
              title: item.title,
              position: {lat: item.lat, lng: item.lng},
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                fillColor: "#F00",
                fillOpacity: 0.9,
                strokeWeight: 0.4
              }
            };
            item.clickable = true;
            item.info = item.title;
            item.cover = this.getFullImageURL(item.cover);
            item.showPin = item.title && item.lat && item.lng;
          });
          this.markers = pins.items.filter((item: any) => {
            return item.showPin;
          });
        },
        err => {
          console.log("error:", err);
        }
      )

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

    if (this.youtubePlayer
      && this.youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      this.youtubePlayer.stopVideo();
    }
  }

  openInfoWindow(markerElement: MapMarker, marker: MarkerObject): void {

    console.log(this.markers);

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

    markerElement.marker?.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: "#F00",
      fillOpacity: 0.9,
      strokeWeight: 10,
      strokeColor: "#FFF",
      strokeOpacity: 0.5
    })

  }
  onReady(event: YT.PlayerEvent): void {
    event.target.playVideo();
  }

  onStateChange(event: YT.OnStateChangeEvent): void {
    if (event.data === YT.PlayerState.CUED && this.shown === "on") {
      event.target.playVideo();
    }
  }

}




