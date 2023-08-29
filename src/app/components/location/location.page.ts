import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';
import { StorageService } from 'src/app/services/storage.service';
declare var google;
@Component({
  selector: 'app-location',
  templateUrl: 'location.page.html',
  styleUrls: ['location.page.scss']
})
export class LocationPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  address: string;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    this.geolocation.getCurrentPosition().then(resp => {
      const latLng = new google.maps.LatLng(
        resp.coords.latitude,
        resp.coords.longitude
      );
      const mapOptions = {
        center: latLng,
        disableDefaultUI: true,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

      this.map = new google.maps.Map(
        this.mapElement.nativeElement,
        mapOptions
      );

      this.map.addListener('dragend', () => {
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
      });
    })
    .catch(error => {
      console.log('Error getting location', error);
    });
  }

  getPinLocation() {
    this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log('getAddressFromCoords ' + lattitude + ' ' + longitude);
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder
      .reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = '';
        const responseAddress = [];
        for (const [key, value] of Object.entries(result[0])) {
          if (value.length > 0) {
            responseAddress.push(value);
          }
        }
        responseAddress.reverse().shift();
        this.address = responseAddress.join(', ');
        this.storageService.setItem({ id: 'location', value: this.address });
      })
      .catch((error: any) => {
        this.address = 'Address Not Available!';
      });
  }
}
