import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuardService  implements CanActivate {
  constructor(private router: Router, private inAppBrowser: InAppBrowser) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

     if ( route && route.data && route.data['externalUrl'] ) {
      // window.open(route.data['externalUrl'],'_system', 'location=yes');
      // return false;

      const options: InAppBrowserOptions = {
        zoom: 'no'
      }
  
      // Opening a URL and returning an InAppBrowserObject
      const browser = this.inAppBrowser.create(route.data['externalUrl'], '_self', options);
  
     }

  
    return false;
  }
}
