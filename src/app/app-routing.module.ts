import { RedirectGuardService } from './guards/redirect-guard.service';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from './components/home/home.page';
import { TermsPage } from './components/terms/terms.page';
import { PrivacyPage } from './components/privacy/privacy.page';

import { CasePage } from './components/case/case.page';
import { LocationPage } from './components/location/location.page';
import { ExtraPage } from './components/extra/extra.page';
import { NotificationPage } from './components/notification/notification.page';
import { ThankYouPage } from './components/thank-you/thank-you.page';
import { FactorsPage } from './components/factors/factors.page';
import { ConfirmationPage } from './components/confirmation/confirmation.page';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'location', component: LocationPage },
  { path: 'terms', component: TermsPage},
  { path: 'privacy', component: PrivacyPage},
  { path: 'case', component: CasePage },
  { path: 'extra', component: ExtraPage },
  { path: 'notification', component: NotificationPage },
  { path: 'factors', component: FactorsPage },
  { path: 'confirmation', component: ConfirmationPage },
  { path: 'thank-you', component: ThankYouPage },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  {
    path: 'about',
    canActivate: [RedirectGuardService],
    component: RedirectGuardService,
    data: {
      externalUrl: 'https://mend.org.au'
    }
  },
  {
    path: 'whoInvolved',
    canActivate: [RedirectGuardService],
    component: RedirectGuardService,
    data: {
      externalUrl: 'https://mend.org.au/#people-involved'
    }
  },
  {
    path: 'contactUs',
    canActivate: [RedirectGuardService],
    component: RedirectGuardService,
    data: {
      externalUrl: 'https://mend.org.au/#get-in-touch'
    }
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
