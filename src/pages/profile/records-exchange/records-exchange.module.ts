import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecordsExchangePage } from './records-exchange';

@NgModule({
  declarations: [
    RecordsExchangePage,
  ],
  imports: [
    IonicPageModule.forChild(RecordsExchangePage),
  ],
})
export class RecordsExchangePageModule {}
