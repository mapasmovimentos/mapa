import {Component, OnInit, ViewChild, Injectable} from '@angular/core';
import {MapInfoWindow, MapMarker, GoogleMap} from '@angular/google-maps';
import {YouTubePlayer} from '@angular/youtube-player';

type MarkerObject = {
  option: google.maps.MarkerOptions,
  videoId: string,
  info: string,
  html: string,
  cover: string
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class AppComponent implements OnInit {

  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild(GoogleMap) map!: GoogleMap;

  videoId: string | null = null;
  html: string | null = null;
  cover: string | null = null;
  pins: {} | null = null;

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

    fetch('https://joilsonmarques.wixsite.com/mysite/_functions-dev/api/Pins')
      .then(res => res.json())
      .then(data => obj = data)
      .then(() => {
        obj.items.forEach((element: any) => {
          if(element.cover){
            element.cover = this.getFullImageURL(element.cover);
          }
          this.markers.push({
            option: {title: element.title, position: {lat: element.lat, lng: element.lng}},
            videoId: element.videoId,
            info: element.title,
            html: element.info,
            cover: element.cover
          });
        });
      })

      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
  }

  getFullImageURL(imageSRC: string) {
    let strReturnImage = "";
    if (imageSRC.startsWith("wix:image:")) {
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

  openInfoWindow(markerElement: MapMarker, marker: MarkerObject): void {
    if (this.youtubePlayer
      && this.youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      this.youtubePlayer.stopVideo();
    }

    this.videoId = marker.videoId;
    this.info = marker.info;
    this.html = marker.html;
    this.cover = marker.cover;

    alert("Boo!");

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




