import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailContactusPage } from './detail-contactus';

@NgModule({
  declarations: [
    DetailContactusPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailContactusPage),
  ],
})
export class DetailContactusPageModule {}
