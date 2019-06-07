import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { Screenshot } from '@ionic-native/screenshot';
import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-collect',
  templateUrl: 'collect.html',
})
export class CollectPage {
	customer_id : any;
	address : any;
	currency : any;
	form = {};
	selectOptions : any;
	price_coin : any;
	price_altcoin : any;
	amount : any;
	viewspecyfy : any;
	code : any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider,
		private screenshot: Screenshot,
		public socket: Socket
	) {
		this.selectOptions = {
		  title: ' ',
		  cssClass : 'select-customer'
		};


		this.getLoadTicker().subscribe(data => {
			
			if (this.currency == 'BTC' && data[0] == "btc_usd")
				this.price_coin = parseFloat(data[1]).toFixed(2);
			if (this.currency == 'ETH' && data[0] == "eth_usd")
				this.price_coin = parseFloat(data[1]).toFixed(2);
			if (this.currency == 'LTC' && data[0] == "ltc_usd")
				this.price_coin = parseFloat(data[1]).toFixed(2);
			if (this.currency == 'EOS' && data[0] == "eos_usd")
				this.price_coin = parseFloat(data[1]).toFixed(2);
			if (this.currency == 'USDT' && data[0] == "usdt_usd")
				this.price_coin = parseFloat(data[1]).toFixed(2);
			if (this.currency == 'DASH' && data[0] == "dash_usd")
				this.price_coin = parseFloat(data[1]).toFixed(2);
			if (this.currency == 'ASIC' && data[0] == "coin_usd")
				this.price_coin = parseFloat(data[1]).toFixed(2);
			if (this.currency == 'XRP' && data[0] == "xrp_usd")
				this.price_coin = parseFloat(data[1]).toFixed(2);

			if (this.form['amount_usd'] != '')
			{
				this.form['amount_currency'] = (parseFloat(this.form['amount_usd'])/parseFloat(this.price_coin)).toFixed(8);
			}

	    });

	}


	getLoadTicker() {

		let observable = new Observable(observer => {
		  this.socket.on('LoadTicker', (data) => {
		    observer.next(data);
		  });
		})
		return observable;
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
				this.currency  = 'BTC';
				this.amount = 0;
				this.viewspecyfy = false;
				this.AccountServer.GetAddressUser(this.customer_id,this.currency)
		        .subscribe((data) => {
		        	loading.dismiss();
					if (data)
					{
				  		this.address =  data.address;

				  		this.code = btoa(this.address+'_'+this.currency+'_'+this.amount+'_payment');
					}

					this.AccountServer.GetPriceAltcoin()
			        .subscribe((data) => {
						if (data.status == 'complete')
						{ 
							this.price_altcoin = data;
							if (this.currency == 'BTC')
								this.price_coin = data.btc_usd;
							if (this.currency == 'ETH')
								this.price_coin = data.eth_usd;
							if (this.currency == 'LTC')
								this.price_coin = data.ltc_usd;
							if (this.currency == 'EOS')
								this.price_coin = data.eos_usd;
							if (this.currency == 'USDT')
								this.price_coin = data.usdt_usd;
							if (this.currency == 'DASH')
								this.price_coin = data.dash_usd;
							if (this.currency == 'ASIC')
								this.price_coin = data.coin_usd;
							if (this.currency == 'XRP')
								this.price_coin = data.xrp_usd;
						}
						
			        })

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


  	onChangeSelect(value){
		this.currency  = value; 
		this.AccountServer.GetAddressUser(this.customer_id,this.currency)
        .subscribe((data) => {
        	
			if (data)
			{
		  		this.address =  data.address;
		  		this.code = btoa(this.address+'_'+this.currency+'_'+this.amount+'_payment');
			}
        })

        if (this.currency == 'BTC')
			this.price_coin = this.price_altcoin.btc_usd;
		if (this.currency == 'ETH')
			this.price_coin = this.price_altcoin.eth_usd;
		if (this.currency == 'LTC')
			this.price_coin = this.price_altcoin.ltc_usd;
		if (this.currency == 'EOS')
			this.price_coin = this.price_altcoin.eos_usd;
		if (this.currency == 'USDT')
			this.price_coin = this.price_altcoin.usdt_usd;
		if (this.currency == 'DASH')
			this.price_coin = this.price_altcoin.dash_usd;
		if (this.currency == 'ASIC')
			this.price_coin = this.price_altcoin.coin_usd;
		if (this.currency == 'XRP')
			this.price_coin = this.price_altcoin.xrp_usd;

		if (this.form['amount_usd'] != '')
		{
			this.form['amount_currency'] = (parseFloat(this.form['amount_usd'])/parseFloat(this.price_coin)).toFixed(8);
		}

	}

	onChangeInputUSD(value){
		this.form['amount_currency'] = (parseFloat(value)/parseFloat(this.price_coin)).toFixed(8);
	}
	onChangeInputCOIN(value){

	}
	
	Confirmreceipt(){
		if (this.form['amount_usd'] == '' || this.form['amount_usd'] == undefined)
		{
			this.AlertToast('Please enter a amount USD.','error_form');
		}
		else
		{
			this.amount = this.form['amount_currency'];
			this.form['amount_usd'] = '';
			this.form['amount_currency'] = '';
			this.viewspecyfy = false;
			this.code = btoa(this.address+'_'+this.currency+'_'+this.amount+'_payment');

		}
		
	}
	SpecyfyAmount() {
		this.viewspecyfy = true;
	}


	Screenshot(){
		this.screenshot.save('jpg', 80, 'myscreenshot.jpg').then(success=>{
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
	goback_() {
		this.viewspecyfy = false;
	}

	


	
}
