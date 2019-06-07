import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-aidog-add',
  templateUrl: 'aidog-add.html',
})
export class AidogAddPage {
	currency : any;
	customer_id : any;
	amount_active : any;
	form = {}
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider
	) {}

	ionViewDidLoad() {
		this.currency = this.navParams.get("currency");
		this.customer_id = this.navParams.get("customer_id");
		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});

	  	loading.present();

	  	this.AccountServer.GetActiveInvestmentCurrency(this.customer_id,this.currency)
        .subscribe((data) => {
        	loading.dismiss();
			if (data.status == 'complete')
			{
				this.amount_active = (data.amount).toFixed(8);
			}
			
        })
	}

	goback(){
		this.navCtrl.pop();
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


  	SubmitForm(){
  		if (this.form['amount'] == '' || this.form['amount'] == undefined)
    	{
    		this.AlertToast('Please enter a amount.','error_form');
    		
    	}
    	else
    	{
    		if (this.form['password_transaction'] == '' || this.form['password_transaction'] == undefined)
        	{
        		this.AlertToast('Please enter a password transaction','error_form');
        		
        	}
        	else
        	{
	    		let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			  	});

			  	loading.present();

			  	this.AccountServer.SubmitInvestment(this.customer_id,this.currency,this.form['amount'],this.form['password_transaction'])
		        .subscribe((data) => {
		        	loading.dismiss();
					if (data.status == 'complete')
					{
						this.AlertToast('Ai-Bald Eagle successfully','success_form');
						this.amount_active = (parseFloat(this.amount_active) + parseFloat(this.form['amount'])).toFixed(8);
						this.form['amount'] = '';
						this.form['password_transaction'] = '';
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
}
