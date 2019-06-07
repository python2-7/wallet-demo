import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../../pages/login/login';
@IonicPage()
@Component({
  selector: 'page-modify-password',
  templateUrl: 'modify-password.html',
})
export class ModifyPasswordPage {
	customer_id : any;
	form = {};
	selectOptions : any;
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
		this.selectOptions = {
		  title: ' ',
		  cssClass : 'select-customer-forgot'
		};
	}

	ionViewDidLoad() {
		this.form['types'] = 'Login password';
		
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
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
  	validatePassword(password) {
	  var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	  return regex.test(password);
	}
  	SubmitForm(){
  		if (this.form['password'] == '' || this.form['password'] == undefined)
		{
			this.AlertToast('Please enter the old password','error_form');
		}
		else
		{
			if (this.form['new_password'] == '' || this.form['new_password'] == undefined || !this.validatePassword(this.form['new_password']))
			{
				this.AlertToast('The password minimum eight characters, at least one letter and one number','error_form');
			}
			else
			{
				if (this.form['new_password'] != this.form['re_password'])
				{
					this.AlertToast('The two login passwords do not match','error_form');
				}
				else
				{	
					let loading = this.loadingCtrl.create({
					    content: 'Please wait...'
				  	});

				  	loading.present();
					this.AccountServer.UpdatePassword_User(this.customer_id,this.form['types'],this.form['password'],this.form['new_password'])
			        .subscribe((data) => {
			        	loading.dismiss();
						if (data.status == 'complete')
						{ 
							if (this.form['types'] == 'Transaction password')
							{
								this.AlertToast(data.message,'success_form');
							}
							else
							{
								this.AlertUpdatePassLogin();
							}
							this.form['password'] = '';
							this.form['new_password'] = '';
							this.form['re_password'] = '';
						}
						else
						{
							this.AlertToast(data.message,'error_form');
						}
			        },
			        (err) => {
			        	
			        	if (err)
			        	{
			        		loading.dismiss();
			        		this.SeverNotLogin();
			        	}
			        })
				}
				
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

  	AlertUpdatePassLogin(){
  		const confirm = this.alertCtrl.create({
		title: 'Update password',
		message: 'You have successfully changed the password',
		buttons: [
		{
		  text: 'Cancel',
		  handler: () => {
		    
		  }
		},
		{
		  text: 'Login',
		  handler: () => {
		  	this.storage.remove('customer_id');
		   	this.navCtrl.setRoot(LoginPage);
		  }
		}
		]
		});
		confirm.present();
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
