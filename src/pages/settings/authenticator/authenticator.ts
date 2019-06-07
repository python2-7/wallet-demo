import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';
import { SettingsPage } from '../settings/settings';
import { Clipboard } from '@ionic-native/clipboard';
@IonicPage()
@Component({
  selector: 'page-authenticator',
  templateUrl: 'authenticator.html',
})
export class AuthenticatorPage {
	customer_id : any;
	infomation = {};
	form = {};
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider,
		private clipboard: Clipboard
		
	) {
		
	}

	ionViewDidLoad() {
		
		let loading = this.loadingCtrl.create({
	    	content: 'Please wait...'
	  	});
	  	loading.present();
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
				this.AccountServer.Get2FACode(this.customer_id)
		        .subscribe((data) => {
		        	loading.dismiss();	
					if (data.status == 'complete')
					{
						this.infomation = data;
						
					}
					else
					{
						this.AlertToast(data.message,'error_form');
					}
				})
			}
		})
				
	}

	CopyCode2FA(code){ 
    
		this.clipboard.copy(code);
		this.clipboard.paste().then(
			(resolve: string) => {
				this.AlertToast('Coppy success','success_form');
			},
			(reject: string) => {
				console.log('Error: ' + reject);
			}
		);
	}

	ionViewWillEnter() {
		
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

  	SubmitForm_Enlable(){

  		if (this.form['code_enlable'] == '' || this.form['code_enlable'] == undefined)
		{
			this.AlertToast('Please enter code google authenticator ','error_form');
		}
		else
		{
			
			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});

		  	loading.present();
			this.AccountServer.Enlable2FA(this.customer_id,this.infomation['otp_secret'],this.form['code_enlable'])
	        .subscribe((data) => {
	        	loading.dismiss();
				if (data.status == 'complete')
				{ 
					this.AlertToast(data.message,'success_form');
					this.form['code_enlable'] = '';
					
					this.navCtrl.setRoot(SettingsPage);
					
				}
				else
				{
					this.AlertToast(data.message,'error_form');
				}
	        },
	        (err) => {
	        	
	        	if (err)
	        	{
	        		loading.dismiss();
	        		this.SeverNotLogin();
	        	}
	        })
				
		}
  	}

  	SubmitForm_Disable(){
  		if (this.form['code_disable'] == '' || this.form['code_disable'] == undefined)
		{
			this.AlertToast('Please enter code google authenticator ','error_form');
		}
		else
		{
			
			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});

		  	loading.present();
			this.AccountServer.Disable2FA(this.customer_id,this.form['code_disable'])
	        .subscribe((data) => {
	        	loading.dismiss();
				if (data.status == 'complete')
				{ 
					this.AlertToast(data.message,'success_form');
					this.form['code_enlable'] = '';
					this.navCtrl.setRoot(SettingsPage);
					
				}
				else
				{
					this.AlertToast(data.message,'error_form');
				}
	        },
	        (err) => {
	        	
	        	if (err)
	        	{
	        		loading.dismiss();
	        		this.SeverNotLogin();
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
