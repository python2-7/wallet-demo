import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrcodePartnerPage } from './qrcode-partner';

@NgModule({
  declarations: [
    QrcodePartnerPage,
  ],
  imports: [
    IonicPageModule.forChild(QrcodePartnerPage),
  ],
})
export class QrcodePartnerPageModule {}
