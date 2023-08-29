import { Component, Input } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  templateUrl: 'thank-you.page.html',
  styleUrls: ['thank-you.page.scss']
})

export class ThankYouPage {
  total: number;

  constructor(
    private storageService: StorageService,
    private socialSharing: SocialSharing,
    private router: Router
  ) {
    const items = this.storageService.getItems();

    const foundTotal = items['total'];
    this.total = foundTotal ? +foundTotal.value : null;
  }

  shareFacebook() {
    this.socialSharing.shareViaFacebook('', null, 'https://mend.org.au/').then(() => {
      console.log('It works');
    }).catch((error) => {
      console.log('It fails', error);
    });
  }

  done() {
    this.router.navigateByUrl('/');
  }
}
