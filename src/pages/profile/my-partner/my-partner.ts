import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,InfiniteScroll,Refresher } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { Screenshot } from '@ionic-native/screenshot';
import { Storage } from '@ionic/storage';
import { MyPartnerAidogPage } from '../../profile/my-partner-aidog/my-partner-aidog';
@IonicPage()
@Component({
  selector: 'page-my-partner',
  templateUrl: 'my-partner.html',
})
export class MyPartnerPage {
	customer_id : any;
	count_history : any;
	history : any;
	history_temp : any;
	history_load_no : any;
	count_f1 : any;
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
		
	}

	ionViewDidLoad() {
		this.history_load_no = false;
		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});
	  	loading.present();
		this.customer_id = this.navParams.get("customer_id");
		this.AccountServer.GetMember(this.customer_id,0,10)
        .subscribe((data) => {
        	loading.dismiss();
			if (data)
			{
				
		  		this.history =  data.list_member;
		  		this.count_f1 = data.count_f1;
		  		this.count_history = data.length;
		  		this.history_temp = data;
			}
			
        })
				
	}

	ViewAiDogCustomer(ids,email){
		this.navCtrl.push(MyPartnerAidogPage ,{'customer_id' : ids,'email' : email});
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
		this.AccountServer.GetMember(this.customer_id,0,10)
        .subscribe((data) => {
        	setTimeout(function() {
        		refresher.complete()
        	}, 1000);
        	
			if (data)
			{
		  		this.history =  data.list_member;
		  		this.count_f1 = data.count_f1;
		  		this.count_history = data.length;
		  		this.history_temp = data;
			}
        })
	       
  	}

  	doInfinite(infiniteScroll : InfiniteScroll) {
  		
	  	this.AccountServer.GetMember(this.customer_id,this.history.length,5)
        .subscribe((data) => {
	  		if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"customer_id" : item.customer_id,
				        "email" : item.email,
				        "level" : item.level,
				        "img_profile" : item.img_profile,
				        "date_added" : item.date_added
				  	})
				}
				this.history_temp = data;
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
