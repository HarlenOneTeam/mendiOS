import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { debounceTime } from 'rxjs/operators';
import { timeout } from 'q';
import { from } from 'rxjs';
import { stateMapping } from 'src/app/utils/state-mapping.utils';
declare var google;

@Component({
  selector: 'app-case',
  templateUrl: 'case.page.html',
  styleUrls: ['case.page.scss']
})
export class CasePage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('addressInput') addressInput: ElementRef;
  map: any;
  caseForm: FormGroup;

  googleAutocompleteService = new google.maps.places.AutocompleteService();
  geocoder = new google.maps.Geocoder();
  currentAddress = { place: '', postcode: '', coords: {}};
  autocomplete = { input: '' };
  autocompleteItems = [];
  showAutoComplete = false;
  timer: any;

  ageOptions: any[];
  genders: any[];
  defaultAgeOption: any;

  constructor(
    private formBuilder: FormBuilder,
    private geolocation: Geolocation,
    private storageService: StorageService,
    private zone: NgZone
  ) {
  }

  ngOnInit() {
    this.caseForm = this.formBuilder.group({
      gender: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      date: new FormControl(new Date().toISOString(), Validators.required),
      time: new FormControl(new Date().toISOString(), Validators.required),
      location: new FormControl('', Validators.required),
    });
    this.caseForm.controls.location.valueChanges.pipe(debounceTime(1000))
      .subscribe(newValue => {
        if (newValue !== '' && this.currentAddress.place !== newValue) {
          this.updateSearchResults(newValue);
        }
      });
    this.genders = [{
      name: 'male',
      checked: false
    }, {
      name: 'female',
      checked: false
    }, {
      name: 'unsure',
      checked: false
    }];
    this.ageOptions = [{
      value: '13',
      display: 'Under 13'
    }, {
      value: '14-17',
      display: '14 - 17'
    }, {
      value: '18-29',
      display: '18 - 29'
    }, {
      value: '30-49',
      display: '30 - 49'
    }, {
      value: '50',
      display: '50 Above'
    }, {
      value: 'unsure',
      display: 'Unsure'
    }];
    this.defaultAgeOption = this.ageOptions[0];
    this.loadMap();
    this.loadData();
  }

  loadMap() {
    const items = this.storageService.getItems();
    if (items && items !== {}) {
      const coords: any = items['coords'];
      if (coords) {
        this.createMap(coords.value.latitude, coords.value.longitude);
      } else {
        this.getCurrentLocation();
      }
    } else {
      this.getCurrentLocation();
    }
  }

  createMap(latitude, longitude) {
    const latLng = new google.maps.LatLng(
      latitude,
      longitude
    );
    const mapOptions = {
      center: latLng,
      disableDefaultUI: true,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.getAddressFromCoords(latitude, longitude);
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapOptions
    );
    this.map.addListener('dragend', () => {
      this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
    });
  }

  loadData() {
    const items = this.storageService.getItems();
    let gender: any;
    let age: any;
    let date: any;
    let time: any;
    let location: any;
    let postcode: any;

    if (items && items !== {}) {
      gender = items['gender'];
      age = items['age'];
      date = items['date'];
      time = items['time'];
      location = items['location'];
      postcode = items['postcode'];
      if (gender && gender.value) {
        const selectedGender = this.genders.find(g => g.name === gender.value);
        selectedGender.checked = true;
        this.caseForm.controls.gender.setValue(gender.value);
      }
      if (age && age.value) {
        this.defaultAgeOption = this.ageOptions.find(f => f.value === age.value);
        this.caseForm.controls.age.setValue(age.value);
      } else {
        this.defaultAgeOption = this.ageOptions.find(f => f.value === this.ageOptions[0].value);
        this.caseForm.controls.age.setValue(this.ageOptions[0].value);
      }
      if (date && date.value) {
        this.caseForm.controls.date.setValue(date.value);
      }
      if (time && time.value) {
        this.caseForm.controls.time.setValue(time.value);
      }
      if (location && location.value) {
        this.caseForm.controls.location.setValue(location.value);
        this.currentAddress.place = location.value;
        this.setMapCenter(location.value);
      } else {
        this.getCurrentLocation();
      }
      if (postcode && postcode.value) {
        this.currentAddress.postcode = postcode.value;
      }
      // alert(postcode.value);
    } else {
      this.caseForm.controls.age.setValue(this.ageOptions[0].value);
      this.getCurrentLocation();
    }
    this.setItem('gender');
    this.setItem('age');
    this.setItem('date');
    this.setItem('time');
    this.setItem('location');
  }

  setMapCenter(address) {
    this.geocoder.geocode({address}, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.map.setCenter(results[0].geometry.location);
      }
    });
  }

  getCurrentLocation() {
    let options = {timeout: 10000, enableHighAccuracy: true, maximumAge: 3600};
    from(this.geolocation.getCurrentPosition(options)).subscribe(resp => {
      this.createMap(resp.coords.latitude, resp.coords.longitude);
    });
  }

  onAgeSelect(event: any) {
    this.caseForm.controls.age.setValue(event.value);
    this.setItem('age');
  }

  onChange(id: string) {
    this.setItem(id);
  }

  clearAddress() {
    clearTimeout(this.timer);
    this.caseForm.controls.location.setValue('');
    // this.currentAddress.place = '';
    this.addressInput.nativeElement.focus();
  }

  onClickAddress() {
    this.showAutoComplete = true;
    this.updateSearchResults(this.caseForm.controls.location.value);
  }

  onBlurAddress() {
    this.timer = setTimeout(() => {
      this.showAutoComplete = false;
      if (this.currentAddress.place !== this.caseForm.controls.location.value) {
        this.caseForm.controls.location.setValue(this.currentAddress.place);
        this.storageService.setItem({ id: 'location', value: this.currentAddress.place });
        this.storageService.setItem({ id: 'postcode', value: this.currentAddress.postcode });
        // alert(this.currentAddress.postcode);
      }
    }, 300);
  }

  isChecked(gender: string) {
    const item = this.genders.find(d => d.name === gender);
    return (item) ? item.checked : false;
  }

  toggle(gender: string) {
    this.genders.forEach(g => g.checked = false);
    const item = this.genders.find(d => d.name === gender);
    if (item) {
      item.checked = true;
    }

    this.caseForm.controls.gender.setValue(item.name);
    this.setItem('gender');
  }

  selectSearchResult(item) {
    this.autocompleteItems = [];
    this.geocoder.geocode({placeId: item.place_id}, (results, status) => {
      if (status === 'OK' && results[0]) {
        const position = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        this.map.setCenter(results[0].geometry.location);
        this.caseForm.controls.location.setValue(results[0].formatted_address);
        const postcodeType = results[0].address_components.filter(c => {
          if (c.types.find(t => t === 'postal_code')) {
            return c;
          }
        });
        this.storageService.setItem({ id: 'location', value: results[0].formatted_address });
        this.currentAddress.place = results[0].formatted_address;

        if (postcodeType && postcodeType.length) {
          this.storageService.setItem({id: 'postcode', value: postcodeType[0].long_name });
          this.currentAddress.postcode = postcodeType[0].long_name;
        }

        this.storageService.setItem({ id: 'coords', value: {
          latitude: results[0].geometry.location.lat(),
          longitude: results[0].geometry.location.lng()
        }});
        this.currentAddress.coords = {
          latitude: results[0].geometry.location.lat(),
          longitude: results[0].geometry.location.lng()
        };
      }
    });
  }

  updateSearchResults(newValue: string) {
    if (newValue === '') {
      this.autocompleteItems = [];
      return;
    }
    const request = {
      input: newValue,
      componentRestrictions: {country: 'au'},
    };
    this.googleAutocompleteService.getPlacePredictions(request, (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        if (predictions) {
          this.showAutoComplete = true;
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        }
      });
    });
  }

  getAddressFromCoords(latitude, longitude) {
    const latlng = {lat: latitude, lng: longitude};
    this.geocoder.geocode({location: latlng}, ((results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const returnedAddress = results[0].formatted_address;
          const postcodeType = results[0].address_components.filter(c => {
            if (c.types.find(t => t === 'postal_code')) {
              return c;
            }
          });

          const postcode = (postcodeType[0]) ? postcodeType[0].short_name : null;
          this.caseForm.controls.location.setValue(returnedAddress);
          this.showAutoComplete = false;

          this.storageService.setItem({ id: 'location', value: returnedAddress });
          this.currentAddress.place = returnedAddress;
          this.storageService.setItem({ id: 'postcode', value: postcode });
          this.currentAddress.postcode = postcode;
          this.storageService.setItem({ id: 'coords', value: { latitude, longitude }});
          this.currentAddress.coords = { latitude, longitude };
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    }));
  }

  isDisabled() {
    const addressValid = this.currentAddress && this.currentAddress.place &&
    this.currentAddress.place !== '' && this.currentAddress.postcode && this.currentAddress.postcode !== '' && this.currentAddress.coords;
    return !(addressValid && this.caseForm.valid);
  }

  setItem(id: string) {
    if (this.caseForm.controls[id] && this.caseForm.controls[id].valid) {
      this.storageService.setItem({ id, value: this.caseForm.controls[id].value });
    }
  }
}