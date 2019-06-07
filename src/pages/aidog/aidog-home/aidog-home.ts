import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { AidogRecordPage } from '../aidog-record/aidog-record';
import { AidogPage } from '../aidog/aidog';
import { AidogRewardPage } from '../aidog-reward/aidog-reward';

import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-aidog-home',
  templateUrl: 'aidog-home.html',
})
export class AidogHomePage {
	status = {};
	status_active = {};
	customer_id : any;
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
			
		

		
	}

	

	ViewAiReccord(){
		this.navCtrl.push(AidogRecordPage);
	}

	ViewAitrade(){
		this.navCtrl.push(AidogPage);
	}
	ViewAiDialing(){
		this.navCtrl.push(AidogRewardPage);
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
