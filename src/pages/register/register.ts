import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { AccountProvider } from '../../providers/server/account';
import { LoginPage } from '../login/login';

import { LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
	form = {};
	scannedCode : any;
	customer_sponser = '';
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public AccountServer : AccountProvider,
		private barcodeScanner: BarcodeScanner,
		public toastCtrl: ToastController,
		public platform: Platform,
		public alertCtrl: AlertController,
		public storage: Storage,
	) 
	{

	}

	goback() {
		this.navCtrl.setRoot(LoginPage);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterPage');
	}
	
	validateEmail(email) {
	  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  return regex.test(email);
	}
	validatePassword(password) {
	  var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	  return regex.test(password);
	}
	SubmitForm() { 
		
		if (!this.validateEmail(this.form['email']))
		{
			this.AlertToast('Your email is not properly formatted','error_form');
		}
		else
		{
			if (this.form['password'] == '' || this.form['password'] == undefined || !this.validatePassword(this.form['password']))
			{
				this.AlertToast('The password minimum eight characters, at least one letter and one number','error_form');
			}
			else
			{
				if (this.form['re_password'] != this.form['password'])
				{
					this.AlertToast('The two login passwords do not match','error_form');
				}
				else
				{
					if (this.form['password_transaction'] == '' || this.form['password_transaction'] == undefined || !this.validatePassword(this.form['password_transaction']))
					{
						this.AlertToast('The transaction password minimum eight characters, at least one letter and one number','error_form');
					}
					else
					{
						if (this.form['password_transaction'] != this.form['re_password_transaction'])
						{
							this.AlertToast('The two transaction passwords do not match','error_form');
						}
						else
						{
							let loading = this.loadingCtrl.create({
							    content: 'Please wait...'
						  	});
 
						  	loading.present();

						  	let p_node = '';
						  	if (this.form['customer_sponser'] != '' && this.form['customer_sponser'] != undefined)
						  	{
						  		let string = this.form['customer_sponser'].replace(" ","");
						  		let string_slip = atob(string).split("****");
						  		p_node = string_slip[0];
						  	}
	      					
						  	

							this.AccountServer.Signup(this.form['email'].replace(" ",""),this.form['password'].replace(" ",""),this.form['password_transaction'].replace(" ",""),p_node)
					        .subscribe((data) => {
								if (data.status == 'complete')
								{
									loading.dismiss();
									
									this.navCtrl.setRoot(LoginPage);
									this.AlertToast('Account successfully created','success_form');	

								}
								else
								{
									loading.dismiss();
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
				}
			}
		}
	}


	scanCode() {
    
	    this.barcodeScanner.scan({
	      preferFrontCamera : false,
	      showFlipCameraButton : false,
	      showTorchButton : false,
	      disableSuccessBeep : true,
	      resultDisplayDuration : 0,
	      prompt : ''
	    }).then(barcodeData => {
	      this.scannedCode = barcodeData.text;
	      
	      let string = barcodeData.text;
	      let string_slip = atob(string).split("****");

	      if (string_slip[0])
	      {
	      	this.customer_sponser = string_slip[0];
	      	this.form['customer_sponser'] = barcodeData.text;
	      	this.AlertToast('You are registered with sponser '+string_slip[1],'success_form')
	      }
	      else
	      {
	      	this.AlertToast('Error Qrcode','error_form')
	      	
	      }
	      	
		  
  		  
	    }, (err) => {
	        //this.AlertToast('Error Qrcode','error_form')
	        console.log('Error: ', err);
	    });
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
}
