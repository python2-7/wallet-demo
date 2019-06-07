import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { AidogRewardRecordPage } from '../aidog-reward-record/aidog-reward-record';

import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-aidog-reward',
  templateUrl: 'aidog-reward.html',
})
export class AidogRewardPage {
	customer_id :any;
	
	number_radom = 0;
	number_dialing_pending = 0;
	setinterval : any;
	button = 'start';
	number_dialing : any;
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
		this.number_radom = 100;
		
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
			 	
				let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			  	});
			  	loading.present();
			  	
			  	this.AccountServer.GetNumberDialing(this.customer_id)
		        .subscribe((data) => {
					if (data)
					{
						this.number_dialing = data.number_dialing;
						this.number_dialing_pending = data.number_dialing_pending;
					}
					loading.dismiss();
		        })
			}
			else
			{
				//this.navCtrl.setRoot(LoginPage);
			}
			
		});
	}

	StartDialing(){
		if (this.number_dialing > 0)
		{
			this.number_dialing = this.number_dialing -1;
			this.button = 'stop';
			let number = 0;
			this.setinterval = setInterval(function(){ 
				number = Math.floor(11 + Math.random() * 90);
				this.number_radom = number;
			}.bind(this), 10); 
		}
		else
		{
			this.AlertToast('You have no turns','error_form');
		}
			
	}
	StopDialing(){
		this.button = 'pedding';
		
		clearInterval(this.setinterval);
		this.AccountServer.UpdateDialing(this.customer_id,this.number_radom)
        .subscribe((data) => {
        	if (data.status == 'complete')
        	{
        		setTimeout(function() {
					this.button = 'start';
				}.bind(this), 1000);
				
				this.AlertToast('Congratulations. You receive '+this.number_radom+' ASIC','success_form');
				
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

  	ViewReccord(){
  		this.navCtrl.push(AidogRewardRecordPage);
  		
  	}

  	goback(){
  		this.navCtrl.pop();
  	}
}
