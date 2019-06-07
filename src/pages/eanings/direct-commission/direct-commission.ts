import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,InfiniteScroll,Refresher } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { Screenshot } from '@ionic-native/screenshot';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-direct-commission',
  templateUrl: 'direct-commission.html',
})
export class DirectCommissionPage {
	customer_id : any;
	count_history : any;
	history : any;
	history_load_no : any;
	selectOptions : any;
	form = {};
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider,
		private screenshot: Screenshot
	) {
		this.selectOptions = {
		  title: ' ',
		  cssClass : 'select-customer'
		};
	}

	ionViewDidLoad() {
		this.form['to_currency'] = ''; 
		this.form['from_currency'] = '';
		this.history_load_no = false;
		
		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});
	  	loading.present();
		this.customer_id = this.navParams.get("customer_id");


		this.AccountServer.GetHisroryProfit(this.customer_id,'Direct commission',0,10)
        .subscribe((data) => {
        	loading.dismiss();
			if (data)
			{
				
		  		this.history =  data;
		  		this.count_history = data.length;
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

  	doRefresh(refresher: Refresher) {
  		this.history_load_no = false;

  		this.AccountServer.GetHisroryProfit(this.customer_id,'Direct commission',0,10)
        .subscribe((data) => {
        	refresher.complete();
			if (data)
			{
				
		  		this.history =  data;
		  		this.count_history = data.length;
			}
			
        }) 
  	}

  	doInfinite(infiniteScroll : InfiniteScroll) {
  		
		this.AccountServer.GetHisroryProfit(this.customer_id,'Direct commission',this.history.length,5)
        .subscribe((data) => {
        	if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({

				  		"username" : item.username,
				        "amount" : item.amount,
				        "currency" : item.currency,
				        "type" : item.type,
				        "detail" : item.detail,
				        "date_added" : item.date_added
				  	})
				}
				
			}
			else
			{
				this.history_load_no = true;
			}

			infiniteScroll.complete();
			
        }) 
  		
		  	
	}

	Screenshot(){
		this.screenshot.save('jpg', 80, 'qrcode.jpg').then(success=>{
			this.AlertToast('Save img success','success_form');
		},
		onError=>{
			this.AlertToast('Save img error','error_form');
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
