import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../providers/server/account';

import { LoginPage } from '../login/login';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
	@ViewChild('passcode1') passcode1;
	@ViewChild('passcode2') passcode2;
	@ViewChild('passcode3') passcode3;
	@ViewChild('passcode4') passcode4;
	@ViewChild('passcode5') passcode5;
	@ViewChild('passcode6') passcode6;

	form = {};
	selectOptions : any;
	status_forgot_step1: any;
	status_forgot_step2: any;
	status_forgot_step3: any;
	code_forgot:any=[];
	code : any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public AccountServer : AccountProvider,
		
		) {
		this.selectOptions = {
		  title: ' ',
		  cssClass : 'select-customer-forgot'
		};

	}

	goback(){
		this.navCtrl.setRoot(LoginPage);
	}
	validatePassword(password) {
	  var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	  return regex.test(password);
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
	SubmitForm_Step1() {

		
		if (this.form['email'] == '' || this.form['email'] == undefined)
		{
			this.AlertToast('The login email cannot be empty','error_form');
		}
		else
		{
			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});

		  	loading.present();

		  	this.AccountServer.ForgotPassword(this.form['email'],this.form['types'])
	        .subscribe((data) => {
	        	loading.dismiss();
				if (data.status == 'complete')
				{ 
					this.status_forgot_step1 = false;
					this.status_forgot_step2 = true;
					this.status_forgot_step3 = false;
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

	

	SubmitForm_Step2(){
		let code = this.form['passcode1']+''+this.form['passcode2']+''+this.form['passcode3']+''+this.form['passcode4']+''+this.form['passcode5']+''+this.form['passcode6'];
		if (code.length == 6)
		{
			this.code = code;
			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});

		  	loading.present();

		  	this.AccountServer.CheckCoceForgotPassword(this.form['email'],code)
	        .subscribe((data) => {
	        	loading.dismiss();
				if (data.status == 'complete')
				{ 
					this.status_forgot_step1 = false;
					this.status_forgot_step2 = false;
					this.status_forgot_step3 = true;
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

	SubmitForm_Step3(){
		if (this.form['password'] == '' || this.form['password'] == undefined || !this.validatePassword(this.form['password']))
		{
			this.AlertToast('The password minimum eight characters, at least one letter and one number','error_form');
		}
		else
		{
			if (this.form['password'] != this.form['re_password'])
			{
				this.AlertToast('The two login passwords do not match','error_form');
			}
			else
			{	
				let loading = this.loadingCtrl.create({
				    content: 'Please wait...'
			  	});

			  	loading.present();
				this.AccountServer.UpdatePassword(this.form['email'],this.form['types'],this.code,this.form['password'])
		        .subscribe((data) => {
		        	loading.dismiss();
					if (data.status == 'complete')
					{ 
						this.AlertToast(data.message,'success_form');
						this.navCtrl.setRoot(LoginPage);
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
	ionViewDidLoad() {
		this.status_forgot_step1 = true;
		this.status_forgot_step2 = false;
		this.status_forgot_step3 = false;
		this.form['types'] = 'Login password';
		
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
}
