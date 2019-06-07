import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewWalletPage } from './add-new-wallet';

@NgModule({
  declarations: [
    AddNewWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewWalletPage),
  ],
})
export class AddNewWalletPageModule {}
