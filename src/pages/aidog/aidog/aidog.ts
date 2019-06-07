import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { AidogRecordPage } from '../aidog-record/aidog-record';
import { AidogAddPage } from '../aidog-add/aidog-add';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-aidog',
  templateUrl: 'aidog.html',
})
export class AidogPage {
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
			
		this.status['BTC'] = 'off';
		this.status_active['BTC'] = 'none';
		this.status['ETH'] = 'off';
		this.status_active['ETH'] = 'none';
		this.status['LTC'] = 'off';
		this.status_active['LTC'] = 'none';
		this.status['XRP'] = 'off';
		this.status_active['XRP'] = 'none';
		this.status['USDT'] = 'off';
		this.status_active['USDT'] = 'none';
		this.status['DASH'] = 'off';
		this.status_active['DASH'] = 'none';
		this.status['EOS'] = 'off';
		this.status_active['EOS'] = 'none';
		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});

	  	loading.present();
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;

				this.AccountServer.GetActiveInvestment(this.customer_id)
		        .subscribe((data) => {
		        	loading.dismiss();
					if (data)
					{
						for (var i = data.length - 1; i >= 0; i--) {
							this.status[data[i].currency] = 'on';
							this.status_active[data[i].currency] = 'active';
							
						}
						

					}
					
		        })
				
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
	DisableInvestment(currency){
		const confirm = this.alertCtrl.create({
		title: 'Do you want to stop Ai-Bald Eagle?',
		message: 'Select Ok to stop Ai-Bald Eagle. Select cancel to continue',
		buttons: [
		{
		  text: 'Cancel',
		  handler: () => {
		    
		  }
		},
		{
		  	text: 'Ok',
		  	handler: () => {
		  		let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			  	});

			  	loading.present();

			  	this.AccountServer.DisableInvestment(this.customer_id,currency)
		        .subscribe((data) => {
		        	loading.dismiss();
					if (data.status == 'complete')
					{
						this.AlertToast('Disable Ai-Bald Eagle successfully','success_form');
						this.status[currency] = 'off';
						this.status_active[currency] = 'none';
						return true;

					}
					else
					{
						this.AlertToast(data.message,'error_form');
						return false;
					}
		        })
		   		
		  	}
		}
		] 
		});
		confirm.present();
	}

	ViewReccord(){
		this.navCtrl.push(AidogRecordPage);
	}

	AddInvestment(currency){
		this.navCtrl.push(AidogAddPage,{'currency': currency,'customer_id' : this.customer_id});
	}

	ActiveInvestment(currency) {
		this.status[currency] = 'on';
	  let alert = this.alertCtrl.create({
	    title: 'Open Ai-Bald Eagle',
	    cssClass:'prompt_alert_customer',
	    enableBackdropDismiss : false,
	    inputs: [
	      {
	        name: 'amount',
	        placeholder: 'Please enter the number',
	        type: 'number'
	      },
	      {
	        name: 'password_transaction',
	        placeholder: 'Please input the transaction password',
	        type: 'password'
	      }
	    ],
	    buttons: [
	      {
	        text: 'Cancel',
	        role: 'cancel',
	        handler: data => {
	          this.status[currency] = 'off';
	        }
	      },
	      {
	        text: 'OK',
	        handler: data => {
	        	if (data.amount == '' || data.amount == undefined)
	        	{
	        		this.AlertToast('Please enter a amount.','error_form');
	        		return false;
	        	}
	        	else
	        	{
	        		if (data.password_transaction == '' || data.password_transaction == undefined)
		        	{
		        		this.AlertToast('Please enter a password transaction','error_form');
		        		return false;
		        	}
		        	else
		        	{
		        		let loading = this.loadingCtrl.create({
					    content: 'Please wait...'
					  	});

					  	loading.present();

					  	this.AccountServer.SubmitInvestment(this.customer_id,currency,data.amount,data.password_transaction)
				        .subscribe((data) => {
				        	loading.dismiss();
							if (data.status == 'complete')
							{
								this.AlertToast('Ai-Bald Eagle successfully','success_form');
								this.status[currency] = 'on';
								this.status_active[currency] = 'active';
								return true;

							}
							else
							{
								this.AlertToast(data.message,'error_form');
								this.status[currency] = 'off';
								this.status_active[currency] = 'none';
								return false;
							}
				        },
				        (err) => {
				        	loading.dismiss();
				        	if (err)
				        	{
				        		this.SeverNotLogin();
				        		return false;
				        	}
				        })

		        	}
	        	}
				
				
	        }
	      }
	    ]
	  });
	  alert.present();
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
