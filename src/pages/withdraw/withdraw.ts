import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../providers/server/account';

import { ContactPage } from '../contact/contact/contact';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {
	form = {};
	customer_id : any;
	currency : any;
	balance : any;
	address : any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider,
		private barcodeScanner: BarcodeScanner
		) {
	}

	ionViewDidLoad() {
		this.currency = this.navParams.get("currency");
		this.balance = this.navParams.get("balance");
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
			}
		})
	}

	ionViewWillEnter() {
		this.address = this.navParams.get('address') || null;
		this.form['address'] = this.address;

		let elements = document.querySelectorAll(".tabbar.show-tabbar");
		if (elements != null) {
	        Object.keys(elements).map((key) => {
	            elements[key].style.display = 'none';
	        });
	    }
	} 

	ViewContact(){
		this.navCtrl.push(ContactPage ,{'currency' : this.currency});
	}

	
  	ionViewWillLeave() {
  		let elements = document.querySelectorAll(".tabbar.show-tabbar");
		if (elements != null) {
	        Object.keys(elements).map((key) => {
	            elements[key].style.display = 'flex';
	        });
	    }
  	}

  	MaxAmount(){
  		this.form['amount'] = this.balance;
  	}

	SubmitForm() {
		
		if (this.form['amount'] == '' || this.form['amount'] == undefined)
		{
			this.AlertToast('Please enter a amount.','error_form');
		}	
		else
		{
			if (this.form['address'] == '' || this.form['address'] == undefined)
			{
				this.AlertToast('Please enter a address.','error_form');
			}
			else
			{
				if (this.form['password_transaction'] == '' || this.form['password_transaction'] == undefined)
				{
					this.AlertToast('Please enter a password transaction.','error_form');
				}
				else
				{
					let loading = this.loadingCtrl.create({
					    content: 'Please wait...'
				  	});

				  	loading.present();

				  	this.AccountServer.WithdrawCurrency(this.customer_id,this.form['address'],this.form['amount'],this.currency,this.form['password_transaction'])
			        .subscribe((data) => {
			        	loading.dismiss();
						if (data.status == 'complete')
						{
							this.AlertToast('Withdraw successfully','success_form');
							this.balance = (parseFloat(this.balance)-parseFloat(this.form['amount'])).toFixed(8);
							this.form['address'] = '';
							this.form['amount'] = '';
							this.form['password_transaction'] = '';
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
	}
	goback() {
		this.navCtrl.pop();
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
	      
	      let string = barcodeData.text;
	      if (string)
	      {
	      	this.form['address'] = string;
	      }
	      else
	      {
	      	this.AlertToast('Error Wallet','error_form');
	      }
	    }, (err) => {
	    	this.form['address'] = '';
	        this.AlertToast('Error Wallet','error_form');
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
}
