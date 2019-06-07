import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransanctionsPage } from './transanctions';

@NgModule({
  declarations: [
    TransanctionsPage,
  ],
  imports: [
    IonicPageModule.forChild(TransanctionsPage),
  ],
})
export class TransanctionsPageModule {}
