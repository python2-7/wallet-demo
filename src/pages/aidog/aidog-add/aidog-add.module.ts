import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AidogAddPage } from './aidog-add';

@NgModule({
  declarations: [
    AidogAddPage,
  ],
  imports: [
    IonicPageModule.forChild(AidogAddPage),
  ],
})
export class AidogAddPageModule {}
