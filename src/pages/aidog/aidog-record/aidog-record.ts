import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,InfiniteScroll,Refresher } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-aidog-record',
  templateUrl: 'aidog-record.html',
})
export class AidogRecordPage {
	history : any;
	count_history = 0;
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
		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});

	  	loading.present();
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				
				this.customer_id = customer_id;

				this.AccountServer.GetHistoryInvestment(this.customer_id,0,10)
		        .subscribe((data) => {
		        	loading.dismiss();
					if (data)
					{
						this.history =  data;
		  				this.count_history = data.length;
					}
					
		        })
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
	goback() {
		this.navCtrl.pop();
	}

	doInfinite(infiniteScroll : InfiniteScroll) {
  		
	  	this.AccountServer.GetHistoryInvestment(this.customer_id,this.history.length,5)
        .subscribe((data) => {
        	
			
	  		if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"username" : item.username,
				        "package" : item.package,
				        "currency" : item.currency,
				        "status" : item.status,
				        "amount_usd" : item.amount_usd,
				        "date_added" : item.date_added
				  	})
				}
			}
			infiniteScroll.complete();
			
			
        })
	}
	doRefresh(refresher: Refresher) {
		this.AccountServer.GetHistoryInvestment(this.customer_id,0,10)
        .subscribe((data) => {
        	
			if (data)
			{
				this.history =  data;
  				this.count_history = data.length;
			}
			refresher.complete()
        })
		
  	}
}
