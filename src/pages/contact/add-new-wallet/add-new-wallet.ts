import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
@IonicPage()
@Component({
  selector: 'page-add-new-wallet',
  templateUrl: 'add-new-wallet.html',
})
export class AddNewWalletPage {
	form = {}; 	
	toppings = 'bacon';
	selectOptions : any;
	customer_id : any;
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
		this.selectOptions = {
		  title: '',
		  cssClass : 'select-customer'
		};
	}

	ionViewDidLoad() {

		if (this.navParams.get("currency"))
		{
			this.form['currency'] = this.navParams.get("currency");
		}
		else
		{
			this.form['currency'] = 'BTC';
		}

		
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
			}
		})
		
	}

	SubmitForm() {
		if (this.form['name'] == '' || this.form['name'] == undefined)
		{
			this.AlertToast('Please enter a name.','error_form');
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

				  	this.AccountServer.AddWalletAddress(this.customer_id,this.form['name'],this.form['address'],this.form['currency'],this.form['password_transaction'])
			        .subscribe((data) => {
			        	loading.dismiss();
						if (data.status == 'complete')
						{
							this.AlertToast('Add wallet address successfully','success_form');
							this.form['name'] = '';
							this.form['address'] = '';
							this.form['currency'] = 'ASIC';
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

  	goback() {
		this.navCtrl.pop();
	}
}
