import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyPartnerPage } from './my-partner';

@NgModule({
  declarations: [
    MyPartnerPage,
  ],
  imports: [
    IonicPageModule.forChild(MyPartnerPage),
  ],
})
export class MyPartnerPageModule {}
