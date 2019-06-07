import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,InfiniteScroll,Refresher } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { Storage } from '@ionic/storage';
import { AddNewContactusPage } from '../../contact-us/add-new-contactus/add-new-contactus';
import { DetailContactusPage } from '../../contact-us/detail-contactus/detail-contactus';
@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
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
		public AccountServer : AccountProvider
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
	
		
	}

	ionViewWillEnter() {
		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});
	  	loading.present();
		this.customer_id = this.navParams.get("customer_id");
		this.AccountServer.GetHisrorySupport(this.customer_id,0,10)
        .subscribe((data) => {
        	loading.dismiss();
			if (data)
			{
				
		  		this.history =  data;
		  		this.count_history = data.length;
			}
			
        })

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

  	ViewAddNewContactUs(){
		this.navCtrl.push(AddNewContactusPage,{'customer_id' : this.customer_id});
	}

  	ViewDetailSupport(_id){
		this.navCtrl.push(DetailContactusPage,{'_id' : _id,'customer_id' : this.customer_id});
	}

  	doRefresh(refresher: Refresher) {
  		this.history_load_no = false;

  		this.AccountServer.GetHisrorySupport(this.customer_id,0,10)
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
  		
		this.AccountServer.GetHisrorySupport(this.customer_id,this.history.length,5)
        .subscribe((data) => {
        	if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
						"_id" : item._id,
				  		"username" : item.username,
				        "message" : item.message,
				        "subject" : item.subject,
				        "status" : item.status,
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
