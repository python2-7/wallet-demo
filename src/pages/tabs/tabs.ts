import { Component } from '@angular/core';

import { AssetsPage } from '../tab/assets/assets';
import { MarketsPage } from '../tab/markets/markets';

import { ProfilePage } from '../tab/profile/profile';
import { PaymentPage } from '../payment/payment/payment';
import { AidogHomePage } from '../aidog/aidog-home/aidog-home';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = AssetsPage;
  tab2Root = MarketsPage;
  tab3Root = PaymentPage;
  tab4Root = AidogHomePage;
  tab5Root = ProfilePage; 

  constructor() {

  }
}
