import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,Refresher } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { AddNewWalletPage } from '../add-new-wallet/add-new-wallet';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
	customer_id : any;
	currency : any;
	history : any;
	count_history = 0;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider
		) {
	}

	ionViewDidLoad() {
		
		this.currency = this.navParams.get("currency");
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
				let loading = this.loadingCtrl.create({
				    content: 'Please wait...'
			  	});

			  	loading.present();

			  	this.AccountServer.GetContactCurrency(this.customer_id,this.currency)
		        .subscribe((data) => {
		        	loading.dismiss();
					if (data)
					{
						this.history =  data;
						console.log(this.history);
				  		this.count_history = data.length;
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
		})
	}

	doRefresh(refresher: Refresher) {
		this.AccountServer.GetContactCurrency(this.customer_id,this.currency)
        .subscribe((data) => {
        	
			if (data)
			{
				this.history =  data;
				console.log(this.history);
		  		this.count_history = data.length;
			}
			setTimeout(function() {
	    		refresher.complete()
	    	}, 1000);
        })
		
	}

	ionViewWillEnter() {
		this.AccountServer.GetContactCurrency(this.customer_id,this.currency)
        .subscribe((data) => {
        	
			if (data)
			{
				this.history =  data;
				console.log(this.history);
		  		this.count_history = data.length;
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

	SelectAddress(address){
		this.navCtrl.getPrevious().data.address = address;
		 this.navCtrl.pop();
	}

	ViewAddNewWalletPage(){
		
		this.navCtrl.push(AddNewWalletPage ,{'currency' : this.currency});
	}
}
