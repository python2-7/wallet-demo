import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,Refresher } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';
import { ProfitDailyPage } from '../../eanings/profit-daily/profit-daily';
import { SystemCommissionPage } from '../../eanings/system-commission/system-commission';
import { DirectCommissionPage } from '../../eanings/direct-commission/direct-commission';
import { LeaderCommissionPage } from '../../eanings/leader-commission/leader-commission';
import { ShareCommissionPage } from '../../eanings/share-commission/share-commission';
@IonicPage()
@Component({
  selector: 'page-eanings',
  templateUrl: 'eanings.html',
})
export class EaningsPage {
	customer_id : any;
	wallet = {};
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
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;


				this.AccountServer.GetInfomationUser(this.customer_id)
		        .subscribe((data) => {
		        	loading.dismiss();	
					if (data.status == 'complete')
					{
						
						this.wallet = data;
						
					}
					else
					{
						this.AlertToast(data.message,'error_form');
					}
				})

			}
		})
				
	}
	doRefresh(refresher: Refresher) {
  		this.AccountServer.GetInfomationUser(this.customer_id)
        .subscribe((data) => {
        	
			if (data.status == 'complete')
			{
				this.wallet = data;
				
			}
			refresher.complete();
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
	
	ViewProfitDaily(){
		this.navCtrl.push(ProfitDailyPage ,{'customer_id' : this.customer_id});
	}

	ViewProfitSystem(){
		this.navCtrl.push(SystemCommissionPage ,{'customer_id' : this.customer_id});
	}

	ViewProfitLeader(){
		this.navCtrl.push(LeaderCommissionPage ,{'customer_id' : this.customer_id});
	}

	ViewProfitReffral(){
		this.navCtrl.push(DirectCommissionPage ,{'customer_id' : this.customer_id});
	}

	ViewProfitShare(){
		this.navCtrl.push(ShareCommissionPage ,{'customer_id' : this.customer_id});
	}

}
