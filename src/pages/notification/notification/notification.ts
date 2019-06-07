import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
	customer_id : any;
	history = {};
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
		
		let loading = this.loadingCtrl.create({
	    	content: 'Please wait...'
	  	});
	  	loading.present();
		this.AccountServer.GetNotificationID(this.navParams.get("_id"))
        .subscribe((data) => {
        	loading.dismiss();
			if (data)
			{
				
		  		this.history =  data;
			}
			
        })
				
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

  	goback() {
		this.navCtrl.pop();
	}
	
}
