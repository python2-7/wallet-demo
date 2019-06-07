import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyAccountPage } from './verify-account';

@NgModule({
  declarations: [
    VerifyAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyAccountPage),
  ],
})
export class VerifyAccountPageModule {}
