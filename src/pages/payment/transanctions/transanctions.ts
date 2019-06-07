import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,InfiniteScroll,Refresher } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-transanctions',
  templateUrl: 'transanctions.html',
})
export class TransanctionsPage {
	customer_id : any;
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
		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});
	  	loading.present();
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
				this.AccountServer.GetHisroryPayment(this.customer_id,0,10)
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
	goback() { 
		this.navCtrl.pop();
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

  	doRefresh(refresher: Refresher) {
  		this.AccountServer.GetHisroryPayment(this.customer_id,0,10)
        .subscribe((data) => {
        	refresher.complete()
			if (data)
			{
		  		this.history =  data;
		  		this.count_history = data.length;
			}
        })
		
  	}
  	doInfinite(infiniteScroll : InfiniteScroll) {
  		
	  	this.AccountServer.GetHisroryPayment(this.customer_id,this.history.length,5)
        .subscribe((data) => {
        	
			
	  		if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"username" : item.username,
				        "amount" : item.amount,
				        "currency" : item.currency,
				        "status" : item.status,
				        "address" : item.address,
				        "types" : item.types,
				        "date_added" : item.date_added
				  	})
				}
			}
			infiniteScroll.complete();
        })
	}
}
