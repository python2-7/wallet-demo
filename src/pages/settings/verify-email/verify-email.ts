import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';
import { SettingsPage } from '../settings/settings';
@IonicPage()
@Component({
  selector: 'page-verify-email',
  templateUrl: 'verify-email.html',
})
export class VerifyEmailPage {
	@ViewChild('passcode1') passcode1;
	@ViewChild('passcode2') passcode2;
	@ViewChild('passcode3') passcode3;
	@ViewChild('passcode4') passcode4;
	@ViewChild('passcode5') passcode5;
	@ViewChild('passcode6') passcode6;
	form = {};
	code_forgot:any=[];
	code : any;
	customer_id : any;
	infomation = {};
	status_step1 : any;
	status_step2 : any;
	
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
		this.status_step1 = true;
		this.status_step2 = false;
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
						this.infomation = data;
					}
					else
					{
						this.AlertToast(data.message,'error_form');
					}
				})
			}
		})
				
	}

	SendCodeVerifyEmail(){
		let loading = this.loadingCtrl.create({
		    content: 'Please wait...'
	  	});

	  	loading.present();

	  	this.AccountServer.SendMailVerify(this.customer_id)
        .subscribe((data) => {
        	loading.dismiss();
			if (data.status == 'complete')
			{ 

				this.status_step1 = false;
				this.status_step2 = true;
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


	SubmitForm_Verify(){
		let code = this.form['passcode1']+''+this.form['passcode2']+''+this.form['passcode3']+''+this.form['passcode4']+''+this.form['passcode5']+''+this.form['passcode6'];
		if (code.length == 6)
		{
			this.code = code;
			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});

		  	loading.present();

		  	this.AccountServer.CheckCoceVerifyEmail(this.customer_id,code)
	        .subscribe((data) => {
	        	loading.dismiss();
				if (data.status == 'complete')
				{ 
					this.AlertToast('Verify email successfully','success_form');
					this.navCtrl.setRoot(SettingsPage);
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

			//console.log(this.form['email'],this.form['types']);
			
		}
		else
		{
			this.AlertToast('The code you entered is incorrect. Please try again','error_form');
		}

		
	}

	onKeyUp(event,index){  
		if(event.target.value.length !=1){
			this.setFocus(index-2);  
			//this.form['passcode'+(index-1)] = '';
		}else{
			this.code_forgot.push(event.target.value);  
			this.setFocus(index);   
		}
		event.stopPropagation();
	}
	setFocus(index){
       
       switch(index){
         case 0:
         this.passcode1.setFocus();
         break;
         case 1:
         this.passcode2.setFocus();
         break;
         case 2:
         this.passcode3.setFocus();
         break;
         case 3:
         this.passcode4.setFocus();
         break;
         case 4:
         this.passcode5.setFocus();
         break;
         case 5:
         this.passcode6.setFocus();
         break;
         }
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
	
}
