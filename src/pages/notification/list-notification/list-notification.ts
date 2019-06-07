import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,Refresher,InfiniteScroll} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';
import { NotificationPage } from '../notification/notification';

@IonicPage()
@Component({
  selector: 'page-list-notification',
  templateUrl: 'list-notification.html',
})
export class ListNotificationPage {
	customer_id : any;
	count_history : any;
	history : any;
	history_load_no : any;
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
				this.AccountServer.GetListNotification(this.customer_id,0,20)
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

  	doRefresh(refresher: Refresher) {
  		this.AccountServer.GetListNotification(this.customer_id,0,20)
        .subscribe((data) => {
			if (data)
			{
				
		  		this.history =  data;
		  		this.count_history = data.length;
			}
			refresher.complete();
        })
  	}

  	ViewDetailNotification(_id){
		this.navCtrl.push(NotificationPage,{'_id' : _id});
	}

  	doInfinite(infiniteScroll : InfiniteScroll) {
		this.AccountServer.GetListNotification(this.customer_id,this.history.length,5)
        .subscribe((data) => {
			if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"_id" : item._id,
				  		"username" : item.username,
				        "content" : item.content,
				        "type" : item.type,
				        "read" : item.read,
				        "status" : item.status,
				        "date_added" : item.date_added
				  	})
				}
			}
			infiniteScroll.complete();
        }) 	
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
