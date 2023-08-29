import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { MenuController } from '@ionic/angular';
import { VersionService } from 'src/app/services/version.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  updateRequired = false;
  iosUpdate = false;
  androidUpdate = false;
  version = {};
  navigate =
    [
      {
        title: 'App',
        url: '/apps',
        icon: 'apps'
      },
      {
        title: 'Book',
        url: '/book',
        icon: 'book'
      },
      {
        title: 'Paint',
        url: '/paint',
        icon: 'brush'
      },
      {
        title: 'Contacts',
        url: '/contacts',
        icon: 'contacts'
      },
      {
        title: 'Facebook',
        url: '/facebook.com',
        icon: 'logo-facebook'
      },
    ];

  constructor(private callNumber: CallNumber, private menu: MenuController, private versionService: VersionService
  ) {
    this.checkUpdates();
  }

  checkUpdates() {
    this.iosUpdate = false;
    this.androidUpdate = false;
    this.updateRequired = false;


    this.versionService.getCurrentVersion().subscribe(result => {

      if (result && result.length) {
        const versionObject = result[0];
        this.version = result[0];
        const currentAndroidVersion = environment['androidVersion'];
        const currentIOSVersion = environment['IOSVersion'];
        if (currentAndroidVersion !== undefined && currentAndroidVersion !== versionObject['android']) {
          this.updateRequired = true;
          this.androidUpdate = true;
        } 
         if (currentIOSVersion !== undefined && currentIOSVersion !== versionObject['ios']) {
          this.updateRequired = true;
          this.iosUpdate = true;
         }
          
        }

    }, error => {
      console.log(error);

    });
  }

  openUpdateLink() {
    let link = '';
    if (this.iosUpdate) {
      environment['IOSVersion'] = this.version['ios'];
      link = 'https://apps.apple.com/au/app/mend/id1472009981';
    } else {
      environment['androidVersion'] = this.version['android'];
      link = 'https://play.google.com/store/apps/details?id=au.org.mend';
    }
    window.location.href = link;

  }
  tapToCall(num: string) {
    const phone = num || '000';
    this.callNumber.callNumber(phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
}
