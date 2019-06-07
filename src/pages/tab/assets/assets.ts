import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,InfiniteScroll,Refresher } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';
import { WalletPage } from '../../wallet/wallet';
import { ListNotificationPage } from '../../notification/list-notification/list-notification';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-assets',
  templateUrl: 'assets.html',
})
export class AssetsPage {
	price_coin = {};
	balance = {};
	total_usd :any;
	customer_id : any;
	list_notification : any;
	
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider,
		public socket: Socket
	) {
		
		this.getLoadTicker().subscribe(data => {
			
			if (data[0] == "btc_usd")
				this.price_coin['bitcoin'] = parseFloat(data[1]).toFixed(2);
			if (data[0] == "eth_usd")
				this.price_coin['ethereum'] = parseFloat(data[1]).toFixed(2);
			if (data[0] == "ltc_usd")
				this.price_coin['litecoin'] = parseFloat(data[1]).toFixed(2);
			if (data[0] == "dash_usd")
				this.price_coin['dash'] = parseFloat(data[1]).toFixed(2);
			if (data[0] == "eos_usd")
				this.price_coin['eos'] = parseFloat(data[1]).toFixed(2);
			if (data[0] == "usdt_usd")
				this.price_coin['tether'] = parseFloat(data[1]).toFixed(2);
			if (data[0] == "xrp_usd")
				this.price_coin['ripple'] = parseFloat(data[1]).toFixed(2);


			this.total_usd = ((parseFloat(this.balance['coin'])*parseFloat(this.price_coin['coin'])/100000000)+
				(parseFloat(this.balance['bitcoin'])*parseFloat(this.price_coin['bitcoin'])/100000000)+
				(parseFloat(this.balance['dash'])*parseFloat(this.price_coin['dash'])/100000000)+
				(parseFloat(this.balance['eos'])*parseFloat(this.price_coin['eos'])/100000000)+
				(parseFloat(this.balance['ethereum'])*parseFloat(this.price_coin['ethereum'])/100000000)+
				(parseFloat(this.balance['litecoin'])*parseFloat(this.price_coin['litecoin'])/100000000)+
				(parseFloat(this.balance['ripple'])*parseFloat(this.price_coin['ripple'])/100000000)+
				(parseFloat(this.balance['tether'])*parseFloat(this.price_coin['tether'])/100000000)
			).toFixed(2);

			
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

	ionViewWillEnter() {
		
		document.querySelector(".currency_div")['style'].height = this.platform.height()-220+'px';
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
						this.balance['coin'] = data.balance.coin.available;
						this.balance['bitcoin'] = data.balance.bitcoin.available;
						this.balance['dash'] = data.balance.dash.available;
						this.balance['eos'] = data.balance.eos.available;
						this.balance['ethereum'] = data.balance.ethereum.available;
						this.balance['litecoin'] = data.balance.litecoin.available;
						this.balance['ripple'] = data.balance.ripple.available;
						this.balance['tether'] = data.balance.tether.available;
					}
					else
					{
						this.AlertToast(data.message,'error_form');
					}


					this.AccountServer.GetPriceAltcoin()
			        .subscribe((data) => {
						if (data.status == 'complete')
						{ 
							this.price_coin['coin'] = data.coin_usd;
							this.price_coin['bitcoin'] = data.btc_usd;
							this.price_coin['dash'] = data.dash_usd;
							this.price_coin['eos'] = data.eos_usd;
							this.price_coin['ethereum'] = data.eth_usd;
							this.price_coin['litecoin'] = data.ltc_usd;
							this.price_coin['ripple'] = data.xrp_usd;
							this.price_coin['tether'] = data.usdt_usd;

							this.total_usd = ((parseFloat(this.balance['coin'])*parseFloat(this.price_coin['coin'])/100000000)+
								(parseFloat(this.balance['bitcoin'])*parseFloat(this.price_coin['bitcoin'])/100000000)+
								(parseFloat(this.balance['dash'])*parseFloat(this.price_coin['dash'])/100000000)+
								(parseFloat(this.balance['eos'])*parseFloat(this.price_coin['eos'])/100000000)+
								(parseFloat(this.balance['ethereum'])*parseFloat(this.price_coin['ethereum'])/100000000)+
								(parseFloat(this.balance['litecoin'])*parseFloat(this.price_coin['litecoin'])/100000000)+
								(parseFloat(this.balance['ripple'])*parseFloat(this.price_coin['ripple'])/100000000)+
								(parseFloat(this.balance['tether'])*parseFloat(this.price_coin['tether'])/100000000)
							).toFixed(2);
						}
						else
						{
							this.AlertToast(data.message,'error_form');
						}
			        })

			        this.AccountServer.GetListNotification(this.customer_id,0,10)
			        .subscribe((data) => {
			        	this.list_notification = data;
			        })


		        },
		        (err) => {
		        	loading.dismiss();
		        	if (err)
		        	{
		        		this.SeverNotLogin();
		        	}
		        })
			}
		})
	}


	
  	

	ViewWallet(currency,amount,amount_usd){
		this.navCtrl.push(WalletPage,{'customer_id' : this.customer_id, 'currency' : currency,'amount' : amount,'amount_usd' : amount_usd});
	}

	onScroll(event){

		/*if (parseFloat(event.scrollTop) >= 68)
		{
			document.querySelector(".card_capit_header")['style'].opacity = '0';
			document.querySelector(".card_header")['style'].opacity = '1';
		}
		else{
			document.querySelector(".card_capit_header")['style'].opacity = '1';
			document.querySelector(".card_header")['style'].opacity = '0';
		}*/
		
	}


	ViewListNotification(){
		this.navCtrl.push(ListNotificationPage);
	}

	doInfinite(infiniteScroll : InfiniteScroll) {
	  	
        infiniteScroll.complete();
	}

	doRefresh(refresher: Refresher) {
		this.AccountServer.GetInfomationUser(this.customer_id)
        .subscribe((data) => {
        	
			if (data.status == 'complete')
			{
				this.balance['coin'] = data.balance.coin.available;
				this.balance['bitcoin'] = data.balance.bitcoin.available;
				this.balance['dash'] = data.balance.dash.available;
				this.balance['eos'] = data.balance.eos.available;
				this.balance['ethereum'] = data.balance.ethereum.available;
				this.balance['litecoin'] = data.balance.litecoin.available;
				this.balance['ripple'] = data.balance.ripple.available;
				this.balance['tether'] = data.balance.tether.available;
			}
			


			this.AccountServer.GetPriceAltcoin()
	        .subscribe((data) => {
				if (data.status == 'complete')
				{ 
					this.price_coin['coin'] = data.coin_usd;
					this.price_coin['bitcoin'] = data.btc_usd;
					this.price_coin['dash'] = data.dash_usd;
					this.price_coin['eos'] = data.eos_usd;
					this.price_coin['ethereum'] = data.eth_usd;
					this.price_coin['litecoin'] = data.ltc_usd;
					this.price_coin['ripple'] = data.xrp_usd;
					this.price_coin['tether'] = data.usdt_usd;

					this.total_usd = ((parseFloat(this.balance['coin'])*parseFloat(this.price_coin['coin'])/100000000)+
						(parseFloat(this.balance['bitcoin'])*parseFloat(this.price_coin['bitcoin'])/100000000)+
						(parseFloat(this.balance['dash'])*parseFloat(this.price_coin['dash'])/100000000)+
						(parseFloat(this.balance['eos'])*parseFloat(this.price_coin['eos'])/100000000)+
						(parseFloat(this.balance['ethereum'])*parseFloat(this.price_coin['ethereum'])/100000000)+
						(parseFloat(this.balance['litecoin'])*parseFloat(this.price_coin['litecoin'])/100000000)+
						(parseFloat(this.balance['ripple'])*parseFloat(this.price_coin['ripple'])/100000000)+
						(parseFloat(this.balance['tether'])*parseFloat(this.price_coin['tether'])/100000000)
					).toFixed(2);
				}
				
				refresher.complete();
	        })



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
}
