import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  navigate = 
  [
    {
      title : "About",
      url   : "/about"
    },
    {
      title : "Privacy Policy",
      url   : "/privacy"
    },
    {
      title : "Terms and Conditions",
      url   : "/terms"
    },
    {
      title : "Who's Involved",
      url   : "/whoInvolved"
    },
    {
      title : "Contact Us",
      url   : "/contactUs"
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private storageService: StorageService,
    private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      await this.storageService.deleteAllItems();
    });
  }

  goToDetails(url: string) {
    window.location.href = url;
  }
}
