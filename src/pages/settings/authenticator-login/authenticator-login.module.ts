import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthenticatorLoginPage } from './authenticator-login';

@NgModule({
  declarations: [
    AuthenticatorLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthenticatorLoginPage),
  ],
})
export class AuthenticatorLoginPageModule {}
