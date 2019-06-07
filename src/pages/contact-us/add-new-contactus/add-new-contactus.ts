import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-add-new-contactus',
  templateUrl: 'add-new-contactus.html',
})
export class AddNewContactusPage {
	form = {};
	customer_id : any;
	currency : any;
	balance : any;
	address : any;
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
		this.customer_id = this.navParams.get("customer_id");
		
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

  	SubmitForm() {
		
		if (this.form['title'] == null || this.form['title'] === "" )
		{
			this.AlertToast('Please enter the title of support content','error_form');
		}
		else
		{
			if (this.form['content'] == null || this.form['content'] === "")
			{
				this.AlertToast('Please enter support content','error_form');
			}
			else
			{
				let loadingss = this.loadingCtrl.create({
			    	content: 'Please wait...'
			  	});
			  	loadingss.present();
	          		
            	this.AccountServer.SupportSubmit(this.customer_id,this.form['title'],this.form['content'])
		        .subscribe((data) => {
		        	loadingss.dismiss();
					if (data.status == 'complete')
					{
				  		
						this.AlertToast('Submit successful support information. We will reply you as soon as possible','success_form');

            			
            			this.form['content'] = '';
            			this.form['title'] = '';

					}
					else
					{
						this.AlertToast(data.message,'error_form');
		          	}
		        },
		        (err) => {
		        	if (err)
		        	{
		        		loadingss.dismiss();
		        		this.SeverNotLogin();
		        	}
		        })
					
			}
		}
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
}
