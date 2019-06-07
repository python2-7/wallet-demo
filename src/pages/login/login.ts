import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../providers/server/account';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { Storage } from '@ionic/storage';
import { TouchID } from '@ionic-native/touch-id';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	form = {};
	customer_id : any;
	count_submit_2fa = 0;
	count_login = 0;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public AccountServer : AccountProvider,
		public storage: Storage,
		private touchId: TouchID,
		private androidFingerprintAuth: AndroidFingerprintAuth
		) {
	}
	ionViewDidLoad() {
		this.count_submit_2fa = 0;
		this.count_login = 0;

	}
	SignUp(){
		this.navCtrl.setRoot(RegisterPage);
	}
	ForgotPassword(){
		this.navCtrl.setRoot(ForgotPasswordPage);
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
	SubmitForm() {
		this.count_login ++;
		if (this.count_login <6)
		{
			if (this.form['email'] == '' || this.form['email'] == undefined)
			{
				this.AlertToast('The login email cannot be empty','error_form');
			}
			else
			{
				if (this.form['password'] == '' || this.form['password'] == undefined)
				{
					this.AlertToast('The login password cannot be empty','error_form');
				}
				else
				{
					let loading = this.loadingCtrl.create({
					    content: 'Please wait...'
				  	});

				  	loading.present();

				  	this.AccountServer.Login(this.form['email'].replace(" ",""),this.form['password'].replace(" ",""))
			        .subscribe((data) => {
			        	loading.dismiss();
						if (data.status == 'complete')
						{
							this.storage.set('customer_id', data.customer_id); 
							this.customer_id = data.customer_id;
							if (parseInt(data.status_fingerprint) == 0)
							{
								this.navCtrl.setRoot(TabsPage);
								
							}
							else
							{
								this.Fingerprint_login();
							}
							

						}
						else
						{
							this.AlertToast(data.message,'error_form');
						}
			        },
			        (err) => {
			        	loading.dismiss();
			        	if (err)
			        	{
			        		this.SeverNotLogin();
			        	}
			        })
				}
			}
		}
		else
		{
			setTimeout(function() {
        		this.platform.exitApp();
        	}.bind(this), 3000);
			this.AlertToast('You have entered the wrong number too many times','error_form');
		}
	}

	Fingerprint_login()
	{
		if (this.platform.is('ios'))
		{ 
			this.touchId.isAvailable()
			.then(
			    res => {

			    	this.touchId.verifyFingerprint('Scan your fingerprint please')
					.then(
						res => {
							this.navCtrl.setRoot(TabsPage);
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
		else if  (this.platform.is('android'))
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
		                    	this.navCtrl.setRoot(TabsPage);
		                       
		                    } else if (result.withBackup) 
		                    {
		                    	this.navCtrl.setRoot(TabsPage);
		                        
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
		else 
		{
			this.navCtrl.setRoot(TabsPage);
		}

	}

	AuthenLoginPopup()
	{
		let alert = this.alertCtrl.create({
		    title: 'Google authenticator',
		    cssClass: 'prompt_alert_customer',
		    enableBackdropDismiss: false,
		    inputs: [{
		            name: 'code_2fa',
		            placeholder: 'Please enter your code.',
		            type: 'number'
		        }
		    ],
		    buttons: [{
		            text: 'Exit App',
		            role: 'cancel',
		            handler: data => {
		                this.platform.exitApp();
		            }
		        },
		        {
		            text: 'Confirm',
		            handler: data => {
		            	this.count_submit_2fa ++;
		                if (data.code_2fa == '' || data.code_2fa == undefined) {
		                    this.AlertToast('Please enter your code.', 'error_form');
		                    return false;
		                } 
		                else 
		                {
		                    if (this.count_submit_2fa >=6)
		                    {
		                    	this.AlertToast('You have entered the wrong number too many times', 'error_form');
		                    	this.storage.remove('customer_id');
		                    	setTimeout(function() {
		                    		this.platform.exitApp();
		                    	}.bind(this), 3000);
		                    	
		                    }
		                    else
		                    {
		                    	let loading = this.loadingCtrl.create({
		                            content: 'Please wait...'
		                        });

		                        loading.present();

		                        this.AccountServer.CheckCode2fA(this.customer_id,data.code_2fa)
		                        .subscribe((data) => {
		                            loading.dismiss();
		                            if (data.status == 'complete') {
		                               	this.navCtrl.setRoot(TabsPage);
		                                return true;

		                            } else {
		                                this.AlertToast(data.message, 'error_form');
		                                this.AuthenLoginPopup();
		                                return false;
		                            }
		                        },
		                        (err) => {
		                            loading.dismiss();
		                            if (err) {
		                                this.SeverNotLogin_2fa();

		                                return false;
		                            }
		                        })
		                    }
		                        
		                }
		            }
		        }
		    ]
		});
		alert.present();
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
  	SeverNotLogin_2fa() {
	    const confirm = this.alertCtrl.create({
	        title: 'System maintenance',
	        message: 'The system is updating. Please come back after a few minutes',
	        buttons: [{
	                text: 'Cancel',
	                handler: () => {
	                	this.AuthenLoginPopup();
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
	
}
