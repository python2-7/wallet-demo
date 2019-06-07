import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';
import { VerifyEmailPage } from '../../settings/verify-email/verify-email';
import { ModifyPasswordPage } from '../../settings/modify-password/modify-password';
import { VerifyAccountPage } from '../../settings/verify-account/verify-account';


import { AuthenticatorPage } from '../../settings/authenticator/authenticator';
import { AuthenticatorLoginPage } from '../../settings/authenticator-login/authenticator-login';
import { AboutUsPage } from '../../settings/about-us/about-us';
import { TouchID } from '@ionic-native/touch-id';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
	customer_id : any;
	infomation = {};
	
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider,
		private touchId: TouchID,
		private androidFingerprintAuth: AndroidFingerprintAuth
	) {
		
	}

	ionViewDidLoad() {
		
		
		
				
	}

	ionViewWillEnter() {
		let loading = this.loadingCtrl.create({
	    	content: 'Please wait...'
	  	});
	  	loading.present();
	  	this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
				this.AccountServer.GetInfomationUser(this.customer_id)
		        .subscribe((data) => {
		        	loading.dismiss();	
					if (data.status == 'complete')
					{
						this.infomation = data;
						this.infomation['status_verited'] = data.security.email.status;
						this.infomation['status_2fa'] = data.security.authenticator.status;
						this.infomation['status_fingerprint'] = data.security.fingerprint.status;
						this.infomation['status_verityaccount'] = data.security.verifyaccount.status;
						
					}
					else
					{
						this.AlertToast(data.message,'error_form');
					}
				})
			}
		})
				
		let elements = document.querySelectorAll(".tabbar.show-tabbar");
		if (elements != null) {
	        Object.keys(elements).map((key) => {
	            elements[key].style.display = 'none';
	        });
	    }
   	}
  	ionViewWillLeave() {
  		let elements = document.querySelectorAll(".tabbar.show-tabbar");
		if (elements != null) {
	        Object.keys(elements).map((key) => {
	            elements[key].style.display = 'flex';
	        });
	    }
  	}

  	ViewVerifyEmail(){
  		if (parseInt(this.infomation['status_verited']) == 0)
  		{
  			this.navCtrl.push(VerifyEmailPage ,{'customer_id' : this.customer_id});
  		}
  	}

  	ViewModifyPassword(){
		this.navCtrl.push(ModifyPasswordPage ,{'customer_id' : this.customer_id});
  	}

  	ViewVerifyAccount(){
  		if (parseInt(this.infomation['status_verityaccount']) != 2)
  		{
  			this.navCtrl.push(VerifyAccountPage ,{'customer_id' : this.customer_id});
  		}
  		
		
  	}
  	

  	ViewAuthenticator(){
		this.navCtrl.push(AuthenticatorPage ,{'customer_id' : this.customer_id});
  	}
  	AuthenticatorLogin(){
		this.navCtrl.push(AuthenticatorLoginPage ,{'customer_id' : this.customer_id});
  	}
  	
  	AboutUs(){
		this.navCtrl.push(AboutUsPage ,{'customer_id' : this.customer_id});
  	}
  	
  	 
  	Fingerprint_login(){
  		if (this.platform.is('ios'))
  		{
  			this.touchId.isAvailable()
			.then(
			    res => {
			    	this.touchId.verifyFingerprint('Scan your fingerprint please')
					.then(
						res => {
							this.LoadFingerprint();
						},
						err => {
							
							if (err.code == -1)
							{
								this.AlertToast('Fingerprint scan failed more than 3 times','error_form')
							}
							if (err.code == -4)
							{
								this.AlertToast('The scan was cancelled by the system','error_form')
							}
							if (err.code == -6)
							{
								this.AlertToast('TouchID is not Available','error_form')
							}
							if (err.code == -8)
							{
								this.AlertToast('TouchID is locked out from too many tries','error_form')
							}
						}
					)
			    },
			    err => {
					if (err.code == -1)
					{
						this.AlertToast('Fingerprint scan failed more than 3 times','error_form')
					}
					if (err.code == -4)
					{
						this.AlertToast('The scan was cancelled by the system','error_form')
					}
					if (err.code == -6)
					{
						this.AlertToast('TouchID is not Available','error_form')
					}
					if (err.code == -8)
					{
						this.AlertToast('TouchID is locked out from too many tries','error_form')
					}
				}
			)
  		}
	  	
	  	else if (this.platform.is('android'))
	  	{
	  		this.androidFingerprintAuth.isAvailable()
		    .then((result) => {
		        
		        if (result.isAvailable) {
		            this.androidFingerprintAuth.encrypt({
		                    clientId: 'kjgjkgjkgkjgkjgkjkgkjgkj',
		                    username: 'myUsername',
		                    password: 'myPassword',
		                    locale : 'en_US'
		                })
		                .then(result => {
		                    if (result.withFingerprint) 
		                    {
		                    	this.LoadFingerprint();
		                       
		                    } else if (result.withBackup) 
		                    {
		                    	this.LoadFingerprint();
		                        
		                    } else 
		                    	this.AlertToast('Didn\'t authenticate!','error_form');
		                })
		                .catch(error => {
		                    if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
		                        console.log('Fingerprint authentication cancelled');
		                    } else console.error(error)
		                });

		        } 
		        else 
		        {
		            this.AlertToast('Fingerprint auth isn\'t available','error_form');
		        }
		    })
		    .catch(error => this.AlertToast('Fingerprint auth isn\'t available','error_form'));
	  	}	

	  	else {
	  		this.AlertToast('Fingerprint auth isn\'t available','error_form');
	  	}
  	}

  	LoadFingerprint() {
  		let loading = this.loadingCtrl.create({
	    	content: 'Please wait...'
	  	});
	  	loading.present();
	  	if (parseInt(this.infomation['status_fingerprint']) == 0)
			{
			this.AccountServer.EnlableFingerprint(this.customer_id)
	        .subscribe((data) => {
	        	loading.dismiss();	
				if (data.status == 'complete')
				{
					this.AlertToast(data.message,'success_form');
					this.infomation['status_fingerprint'] =  1;
					
				}
				else
				{
					this.AlertToast(data.message,'error_form');
				}
			})
		}
		else
		{
			this.AccountServer.DisableFingerprint(this.customer_id)
	        .subscribe((data) => {
	        	loading.dismiss();	
				if (data.status == 'complete')
				{
					this.AlertToast(data.message,'success_form');
					this.infomation['status_fingerprint'] =  0;
					
				}
				else
				{
					this.AlertToast(data.message,'error_form');
				}
			})
		}
  	}


	AlertToast(message,class_customer) {
	    let toast = this.toastCtrl.create({
	      message: message,
	      position: 'bottom',
	      duration : 2000,
	      cssClass : class_customer
	    });
	    toast.present();
  	}

  	SeverNotLogin(){
  		const confirm = this.alertCtrl.create({
		title: 'System maintenance',
		message: 'The system is updating. Please come back after a few minutes',
		buttons: [
		{
		  text: 'Cancel',
		  handler: () => {
		    
		  }
		},
		{
		  text: 'Exit',
		  handler: () => {
		   	this.platform.exitApp();
		  }
		}
		]
		});
		confirm.present();
  	}

  	goback() {
		this.navCtrl.pop();
	}
	
}
