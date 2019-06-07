import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AidogHomePage } from './aidog-home';

@NgModule({
  declarations: [
    AidogHomePage,
  ],
  imports: [
    IonicPageModule.forChild(AidogHomePage),
  ],
})
export class AidogHomePageModule {}
