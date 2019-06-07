import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AidogPage } from './aidog';

@NgModule({
  declarations: [
    AidogPage,
  ],
  imports: [
    IonicPageModule.forChild(AidogPage),
  ],
})
export class AidogPageModule {}
