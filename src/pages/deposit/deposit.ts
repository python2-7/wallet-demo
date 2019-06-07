import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../providers/server/account';

import { Storage } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard';
import { Screenshot } from '@ionic-native/screenshot';
@IonicPage()
@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {
	customer_id : any;
	currency: any;
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
		private clipboard: Clipboard,
		private screenshot: Screenshot
	) {
	}

	ionViewDidLoad() {
		this.currency = this.navParams.get("currency");
		let loading = this.loadingCtrl.create({
	    	content: 'Please wait...'
	  	});
	  	loading.present();

		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;

				this.AccountServer.GetAddressUser(this.customer_id,this.currency)
		        .subscribe((data) => {
		        	loading.dismiss();
					if (data.status == 'complete')
					{
						this.address = data.address;
					}
					else
					{
						this.navCtrl.pop();
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
		})
	}


	ShowAddress() {
	
	  let alert = this.alertCtrl.create({
	    title: this.currency+' Deposit Address',
	    cssClass:'prompt_alert_customer deposit_address',
	    
	    message: '<div class"contentpaymentpopup">' +
  			'<img class="chart" src="https://chart.googleapis.com/chart?chs=240x240&cht=qr&chl='+this.address+'&message='+this.currency+'">' +
  			'<p class="address" text-center>'+this.address+'</p>' +
  		'</div>',       
	    buttons: [
	      {
	        text: 'Save Imgage',
	       
	        handler: data => {
	        	this.Screenshot();
	          
	        }
	      },
	      {
	        text: 'Copy',
	        handler: data => {
	        	this.CopyWallet(this.address)
	        	
	        }
	      }
	    ]
	  });
	  alert.present();
	}

	goback() {
		this.navCtrl.pop();
	}

	Screenshot(){
		this.screenshot.save('jpg', 80, 'myscreenshot.jpg').then(success=>{
			this.AlertToast('Save img success','success_form');
		},
		onError=>{
			this.AlertToast('Save img error','error_form');
		});
		
	}

	CopyWallet(address){
    
		this.clipboard.copy(address);

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
