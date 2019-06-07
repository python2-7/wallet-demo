import { Component,ViewChild } from '@angular/core';
import { Nav, Platform, AlertController ,ToastController,LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TouchID } from '@ionic-native/touch-id';
import { TabsPage } from '../pages/tabs/tabs';
//import { VerifyAccountPage } from '../pages/settings/verify-account/verify-account';
/*AI DOG*/
/*import { AidogPage } from '../pages/aidog/aidog/aidog';
import { AidogAddPage } from '../pages/aidog/aidog-add/aidog-add';
import { AidogRewardPage } from '../pages/aidog/aidog-reward/aidog-reward';
import { AidogRecordPage } from '../pages/aidog/aidog-record/aidog-record';*/
/*END AI DOG*/

/*AI DOG*/
/*import { PaymentPage } from '../pages/payment/payment/payment';
import { CollectPage } from '../pages/payment/collect/collect';
import { TransanctionsPage } from '../pages/payment/transanctions/transanctions';*/
/*END AI DOG*/

/*import { ExchangePage } from '../pages/exchange/exchange';
import { DepositPage } from '../pages/deposit/deposit';
import { WithdrawPage } from '../pages/withdraw/withdraw';
import { WalletPage } from '../pages/wallet/wallet';*/

/*CONTACT*/
/*import { ContactPage } from '../pages/contact/contact/contact';
import { AddNewWalletPage } from '../pages/contact/add-new-wallet/add-new-wallet';*/
/*END CONTACT*/

/*SINGUP*/
/*import { RegisterPage } from '../pages/register/register';*/

/*END SINGUP*/

import { LoginPage } from '../pages/login/login';
//import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';


/*import { QrcodePartnerPage } from '../pages/profile/qrcode-partner/qrcode-partner';
import { MyPartnerPage } from '../pages/profile/my-partner/my-partner';*/

/*eanings*/
//import { EaningsPage } from '../pages/eanings/eanings/eanings';
/*end eanings*/


/*Setting*/
/*import { SettingsPage } from '../pages/settings/settings/settings';
import { VerifyEmailPage } from '../pages/settings/verify-email/verify-email';
import { ModifyPasswordPage } from '../pages/settings/modify-password/modify-password';
import { AuthenticatorPage } from '../pages/settings/authenticator/authenticator';
import { AuthenticatorLoginPage } from '../pages/settings/authenticator-login/authenticator-login';
import { AboutUsPage } from '../pages/settings/about-us/about-us';*/

/*end Setting*/

import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AccountProvider } from '../providers/server/account';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';

@Component({ 
  templateUrl: 'app.html'
})
export class MyApp {

	@ViewChild(Nav) nav: Nav;

	rootPage:any = LoginPage; 
	infomation : any = {};
	customer_id : any = '';
	versionApp : any;
	platform: any;
	splashScreen : any;
	counter=0;
	count_submit_2fa = 0;
	system = 'not_check';
	constructor(
		platform: Platform, 
		statusBar: StatusBar, 
		splashScreen: SplashScreen,
		private network: Network,
		public alertCtrl: AlertController,
    	public storage: Storage,
    	public toastCtrl: ToastController,
    	public AccountServer : AccountProvider,
    	public loadingCtrl: LoadingController,
    	private iab: InAppBrowser,
    	private touchId: TouchID,
    	private androidFingerprintAuth: AndroidFingerprintAuth
    	
	){
		this.platform = platform;
		this.splashScreen = splashScreen;
		this.count_submit_2fa = 0;
		this.versionApp = 2;

		if (platform.is('ios'))
		{
			this.system = 'ios';
		}
		if (platform.is('android'))
		{
			this.system = 'android';
		}



		platform.ready().then(() => {
			statusBar.styleDefault();
			
			//check version app
			this.AccountServer.GetVersionApp()
		    .subscribe((data) => {
		        if (data) {
		            if (parseInt(this.versionApp) < parseInt(data.version)) {
		                this.UpdateVersion(data.link_app);
		            }
		        }
		    })

			//exit app
			let pree_back = false;
			platform.registerBackButtonAction(() => { 
			    if (this.counter == 0) {
			        this.counter++;
			        if (pree_back == false) {
			            this.presentToast();
			        }
			        setTimeout(() => {
			            this.counter = 0
			        }, 1500)
			    } else {
			        if (pree_back == false) {
			            pree_back = true;
			            const confirm = this.alertCtrl.create({
			                title: 'Confirm Exit?',
			                message: 'Are you sure to exit the application.',
			                buttons: [{
			                        text: 'Cancel',
			                        handler: () => {
			                            pree_back = false;
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
			});

			//check network
			if (this.network.type == "none") {
			    let confirm = this.alertCtrl.create({
			        title: 'Notification',
			        message: 'We were unable to connect to the server to verify the SSL certificate. Please check your device\'s network connection before proceeding.',
			        buttons: [{
			                text: 'Exit',
			                handler: () => {
			                    this.platform.exitApp();
			                }
			            }

			        ],

			    });

			    confirm.onDidDismiss(data => {
			        this.platform.exitApp();
			    });
			    confirm.present();

			}

			//Check Login
			this.storage.get('customer_id')
		    .then((customer_id) => {
		        if (customer_id) 
		        {
		        	this.customer_id = customer_id;
		            this.AccountServer.GetInfomationUser(customer_id)
			        .subscribe((data) => {
			        	splashScreen.hide();
						if (data.status == 'complete')
						{	
							if (parseInt(data.security.fingerprint.status)==1)
							{
								this.Fingerprint_login();
							}
							
							else
							{
								this.nav.setRoot(TabsPage);
							}
						}
						else
						{
							this.AlertToast(data.message,'error_form');
							this.nav.setRoot(LoginPage);
						}
			        },
			        (err) => {
			        	splashScreen.hide();
			        	this.SeverNotLogin();
			        })

		        }
		        else
		        {
		        	splashScreen.hide();
		        }
		        
		    });
		});

	}

	Fingerprint_login()
	{
		if (this.system == 'ios')
		{ 
			this.touchId.isAvailable()
			.then(
			    res => {

			    	this.touchId.verifyFingerprint('Scan your fingerprint please')
					.then(
						res => {
							this.nav.setRoot(TabsPage);
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
		else if (this.system == 'android')
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
		                    	this.nav.setRoot(TabsPage);
		                       
		                    } else if (result.withBackup) 
		                    {
		                    	this.nav.setRoot(TabsPage);
		                        
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
			this.nav.setRoot(TabsPage);
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
		                if (data.code_2fa == '' || data.code_2fa == undefined) {
		                    this.AlertToast('Please enter your code.', 'error_form');
		                    return false;
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
	                               	this.nav.setRoot(TabsPage);
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

	platformReady() {
	    this.platform.ready().then(() => {
	        this.splashScreen.hide();
	    });
	}

	UpdateVersion(linl_app) {
	    const confirm = this.alertCtrl.create({
	        title: 'Update System',
	        message: 'The latest version is available. Please update the application.',
	        buttons: [{
	                text: 'Exit',
	                handler: () => {
	                    this.platform.exitApp();
	                }
	            },
	            {
	                text: 'Update',
	                handler: () => {
	                    this.iab.create(linl_app);
	                }
	            }
	        ]
	    });
	    confirm.present();
	}

	SeverNotLogin() {
	    const confirm = this.alertCtrl.create({
	        title: 'System maintenance',
	        message: 'The system is updating. Please come back after a few minutes',
	        buttons: [{
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

	presentToast() {
	    let toast = this.toastCtrl.create({
	        message: "Press again to exit.",
	        duration: 2000,
	        position: "bottom",
	        cssClass : 'error_form'
	    });
	    toast.present();
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
}
