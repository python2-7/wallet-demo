import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthenticatorPage } from './authenticator';

@NgModule({
  declarations: [
    AuthenticatorPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthenticatorPage),
  ],
})
export class AuthenticatorPageModule {}
