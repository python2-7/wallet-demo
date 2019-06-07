import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewContactusPage } from './add-new-contactus';

@NgModule({
  declarations: [
    AddNewContactusPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewContactusPage),
  ],
})
export class AddNewContactusPageModule {}
