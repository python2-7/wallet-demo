import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfitDailyPage } from './profit-daily';

@NgModule({
  declarations: [
    ProfitDailyPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfitDailyPage),
  ],
})
export class ProfitDailyPageModule {}
