import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../providers/server/account';
import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-exchange',
  templateUrl: 'exchange.html',
})
export class ExchangePage {
	form = {};
	selectOptions : any;
	customer_id : any;
	currency : any;
	to_balance : any;
	from_balance : any;
	pricecoin : any;
	to_currency : any;
	from_currency : any;
	price_to : any;
	price_from : any;
	data_balance : any;
	data_price : any;
	string_amount = '0';
	string_estimate = '0';
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
		this.selectOptions = {
		  title: ' ',
		  cssClass : 'select-customer'
		};

		this.getLoadTicker().subscribe(data => {
			

			if (data[0] == "btc_usd" && this.to_currency == 'BTC')
				this.price_to = parseFloat(data[1]).toFixed(2);
			if (data[0] == "eth_usd" && this.to_currency == 'ETH')
				this.price_to = parseFloat(data[1]).toFixed(2);
			if (data[0] == "ltc_usd" && this.to_currency == 'LTC')
				this.price_to = parseFloat(data[1]).toFixed(2);
			if (data[0] == "dash_usd" && this.to_currency == 'DASH')
				this.price_to = parseFloat(data[1]).toFixed(2);
			if (data[0] == "eos_usd" && this.to_currency == 'EOS')
				this.price_to = parseFloat(data[1]).toFixed(2);
			if (data[0] == "usdt_usd" && this.to_currency == 'USDT')
				this.price_to = parseFloat(data[1]).toFixed(2);
			if (data[0] == "xrp_usd" && this.to_currency == 'XRP')
				this.price_to = parseFloat(data[1]).toFixed(2);



			if (data[0] == "btc_usd" && this.from_currency == 'BTC')
				this.price_from = parseFloat(data[1]).toFixed(2);
			if (data[0] == "eth_usd" && this.from_currency == 'ETH')
				this.price_from = parseFloat(data[1]).toFixed(2);
			if (data[0] == "ltc_usd" && this.from_currency == 'LTC')
				this.price_from = parseFloat(data[1]).toFixed(2);
			if (data[0] == "dash_usd" && this.from_currency == 'DASH')
				this.price_from = parseFloat(data[1]).toFixed(2);
			if (data[0] == "eos_usd" && this.from_currency == 'EOS')
				this.price_from = parseFloat(data[1]).toFixed(2);
			if (data[0] == "usdt_usd" && this.from_currency == 'USDT')
				this.price_from = parseFloat(data[1]).toFixed(2);
			if (data[0] == "xrp_usd" && this.from_currency == 'XRP')
				this.price_from = parseFloat(data[1]).toFixed(2);


			if (parseFloat(this.string_amount) > 0)
			{
				let form_usd = this.price_from * parseFloat(this.string_amount);
				let to_coin_exchange = (form_usd/this.price_to).toFixed(8);
				this.string_estimate = (parseFloat(to_coin_exchange)*0.9975).toFixed(8).toString();
			}
	    });

		
		
	}

	Clicknumber(num : string){
		let check_split = this.string_amount.split(".");
		
		if (check_split.length >=2)
		{
			if (check_split[1].length >= 8)
				return false;
		}	
		
		if (num == '.')
		{
			if (this.string_amount.indexOf('.') > -1)
			{
				let elements = document.querySelectorAll(".string_amount");
				if (elements != null) {
			        Object.keys(elements).map((key) => {
			            elements[key].classList.add("error_number");
			            setTimeout(function() {
			            	elements[key].classList.remove("error_number");
			            }, 1000);
			            
			        });
			    }
			}
			else
			{
				if (this.string_amount == '0')
				{
					this.string_amount += num.toString();
				}
				else
				{
					this.string_amount += num.toString();
				}
			}
		}
		else
		{
			if (this.string_amount == '0')
			{
				this.string_amount = num.toString();
			}
			else
			{
				this.string_amount += num.toString();
			}
		}

		if (parseFloat(this.string_amount) > 0)
		{

			let form_usd = this.price_from * parseFloat(this.string_amount);
			let to_coin_exchange = (form_usd/this.price_to).toFixed(8);
			this.string_estimate = (parseFloat(to_coin_exchange)*0.9975).toFixed(8).toString();

		}
	}
	Blackspace(){
		
		if (this.string_amount.length == 1)
		{
			this.string_amount = '0'
		}
		else
		{
			this.string_amount = this.string_amount.substr(0, this.string_amount.length-1);
		}

		if (parseFloat(this.string_amount) > 0)
		{

			let form_usd = this.price_from * parseFloat(this.string_amount);
			let to_coin_exchange = (form_usd/this.price_to).toFixed(8);
			this.string_estimate = (parseFloat(to_coin_exchange)*0.9975).toFixed(8).toString();
		}
		else
		{
			this.string_estimate = '0';
		}
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

	ionViewDidLoad() {
		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});
	  	loading.present();
	  	loading.dismiss();
		this.currency = this.navParams.get("currency");
		this.form['from_currency'] = this.currency;
		this.from_currency = this.form['from_currency'];

		this.form['to_currency'] = 'BTC';
		this.to_currency = this.form['to_currency'];


		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;

				this.AccountServer.GetInfomationUser(this.customer_id)
		        .subscribe((data) => {
		        		
					if (data.status == 'complete')
					{
						this.data_balance = data;
						if (this.to_currency == 'BTC')
							this.to_balance = (parseFloat(data.balance.bitcoin.available)/100000000).toFixed(8);
						if (this.to_currency == 'ETH')
							this.to_balance = (parseFloat(data.balance.ethereum.available)/100000000).toFixed(8);
						if (this.to_currency == 'LTC')
							this.to_balance = (parseFloat(data.balance.litecoin.available)/100000000).toFixed(8);
						if (this.to_currency == 'DASH')
							this.to_balance = (parseFloat(data.balance.dash.available)/100000000).toFixed(8);
						if (this.to_currency == 'EOS')
							this.to_balance = (parseFloat(data.balance.eos.available)/100000000).toFixed(8);
						if (this.to_currency == 'USDT')
							this.to_balance = (parseFloat(data.balance.tether.available)/100000000).toFixed(8);
						if (this.to_currency == 'XRP')
							this.to_balance = (parseFloat(data.balance.ripple.available)/100000000).toFixed(8);
						if (this.to_currency == 'ASIC')
							this.to_balance = (parseFloat(data.balance.coin.available)/100000000).toFixed(8);

						if (this.from_currency == 'BTC')
							this.from_balance = (parseFloat(data.balance.bitcoin.available)/100000000).toFixed(8);
						if (this.from_currency == 'ETH')
							this.from_balance = (parseFloat(data.balance.ethereum.available)/100000000).toFixed(8);
						if (this.from_currency == 'LTC')
							this.from_balance = (parseFloat(data.balance.litecoin.available)/100000000).toFixed(8);
						if (this.from_currency == 'DASH')
							this.from_balance = (parseFloat(data.balance.dash.available)/100000000).toFixed(8);
						if (this.from_currency == 'EOS')
							this.from_balance = (parseFloat(data.balance.eos.available)/100000000).toFixed(8);
						if (this.from_currency == 'USDT')
							this.from_balance = (parseFloat(data.balance.tether.available)/100000000).toFixed(8);
						if (this.from_currency == 'XRP')
							this.from_balance = (parseFloat(data.balance.ripple.available)/100000000).toFixed(8);
						if (this.from_currency == 'ASIC')
							this.from_balance = (parseFloat(data.balance.coin.available)/100000000).toFixed(8);
					}

		        })
		        this.AccountServer.GetPriceAltcoin()
		        .subscribe((data) => {
					if (data.status == 'complete')
					{ 
						this.data_price = data;
						if (this.to_currency == 'BTC')
							this.price_to = data.btc_usd;
						if (this.to_currency == 'ETH')
							this.price_to = data.eth_usd;
						if (this.to_currency == 'LTC')
							this.price_to = data.ltc_usd;
						if (this.to_currency == 'DASH')
							this.price_to = data.dash_usd;
						if (this.to_currency == 'EOS')
							this.price_to = data.eos_usd;
						if (this.to_currency == 'USDT')
							this.price_to = data.usdt_usd;
						if (this.to_currency == 'XRP')
							this.price_to = data.xrp_usd;
						if (this.to_currency == 'ASIC')
							this.price_to = data.coin_usd;

						if (this.from_currency == 'BTC')
							this.price_from = data.btc_usd;
						if (this.from_currency == 'ETH')
							this.price_from = data.eth_usd;
						if (this.from_currency == 'LTC')
							this.price_from = data.ltc_usd;
						if (this.from_currency == 'DASH')
							this.price_from = data.dash_usd;
						if (this.from_currency == 'EOS')
							this.price_from = data.eos_usd;
						if (this.from_currency == 'USDT')
							this.price_from = data.usdt_usd;
						if (this.from_currency == 'XRP')
							this.price_from = data.xrp_usd;
						if (this.from_currency == 'ASIC')
							this.price_from = data.coin_usd;
					}	
		        })
			}
		})
	}

	onChangeSelectFrom(value){
		this.form['from_currency'] = value;
		this.from_currency = this.form['from_currency'];
		if (this.from_currency == 'BTC')
			this.from_balance = (parseFloat(this.data_balance.balance.bitcoin.available)/100000000).toFixed(8);
		if (this.from_currency == 'ETH')
			this.from_balance = (parseFloat(this.data_balance.balance.ethereum.available)/100000000).toFixed(8);
		if (this.from_currency == 'LTC')
			this.from_balance = (parseFloat(this.data_balance.balance.litecoin.available)/100000000).toFixed(8);
		if (this.from_currency == 'DASH')
			this.from_balance = (parseFloat(this.data_balance.balance.dash.available)/100000000).toFixed(8);
		if (this.from_currency == 'EOS')
			this.from_balance = (parseFloat(this.data_balance.balance.eos.available)/100000000).toFixed(8);
		if (this.from_currency == 'USDT')
			this.from_balance = (parseFloat(this.data_balance.balance.tether.available)/100000000).toFixed(8);
		if (this.from_currency == 'XRP')
			this.from_balance = (parseFloat(this.data_balance.balance.ripple.available)/100000000).toFixed(8);
		if (this.from_currency == 'ASIC')
			this.from_balance = (parseFloat(this.data_balance.balance.coin.available)/100000000).toFixed(8);


		if (this.from_currency == 'BTC')
			this.price_from = this.data_price.btc_usd;
		if (this.from_currency == 'ETH')
			this.price_from = this.data_price.eth_usd;
		if (this.from_currency == 'LTC')
			this.price_from = this.data_price.ltc_usd;
		if (this.from_currency == 'DASH')
			this.price_from = this.data_price.dash_usd;
		if (this.from_currency == 'EOS')
			this.price_from = this.data_price.eos_usd;
		if (this.from_currency == 'USDT')
			this.price_from = this.data_price.usdt_usd;
		if (this.from_currency == 'XRP')
			this.price_from = this.data_price.xrp_usd;
		if (this.from_currency == 'ASIC')
			this.price_from = this.data_price.coin_usd;

		this.string_amount = '0';
		this.string_estimate = '0';
	}

	onChangeSelectTo(value){
		this.form['to_currency'] = value;
		this.to_currency = this.form['to_currency'];

		if (this.to_currency == 'BTC')
			this.to_balance = (parseFloat(this.data_balance.balance.bitcoin.available)/100000000).toFixed(8);
		if (this.to_currency == 'ETH')
			this.to_balance = (parseFloat(this.data_balance.balance.ethereum.available)/100000000).toFixed(8);
		if (this.to_currency == 'LTC')
			this.to_balance = (parseFloat(this.data_balance.balance.litecoin.available)/100000000).toFixed(8);
		if (this.to_currency == 'DASH')
			this.to_balance = (parseFloat(this.data_balance.balance.dash.available)/100000000).toFixed(8);
		if (this.to_currency == 'EOS')
			this.to_balance = (parseFloat(this.data_balance.balance.eos.available)/100000000).toFixed(8);
		if (this.to_currency == 'USDT')
			this.to_balance = (parseFloat(this.data_balance.balance.tether.available)/100000000).toFixed(8);
		if (this.to_currency == 'XRP')
			this.to_balance = (parseFloat(this.data_balance.balance.ripple.available)/100000000).toFixed(8);
		if (this.to_currency == 'ASIC')
			this.to_balance = (parseFloat(this.data_balance.balance.coin.available)/100000000).toFixed(8);

		if (this.to_currency == 'BTC')
			this.price_to = this.data_price.btc_usd;
		if (this.to_currency == 'ETH')
			this.price_to = this.data_price.eth_usd;
		if (this.to_currency == 'LTC')
			this.price_to = this.data_price.ltc_usd;
		if (this.to_currency == 'DASH')
			this.price_to = this.data_price.dash_usd;
		if (this.to_currency == 'EOS')
			this.price_to = this.data_price.eos_usd;
		if (this.to_currency == 'USDT')
			this.price_to = this.data_price.usdt_usd;
		if (this.to_currency == 'XRP')
			this.price_to = this.data_price.xrp_usd;
		if (this.to_currency == 'ASIC')
			this.price_to = this.data_price.coin_usd;

		this.string_amount = '0';
		this.string_estimate = '0';
	}


	onChangeInput(value){
		if (value){
			let form_usd = this.price_from * parseFloat(value);
			let to_coin_exchange = (form_usd/this.price_to).toFixed(8);
			this.form['estimate'] = (parseFloat(to_coin_exchange)*0.9975).toFixed(8).toString();
		}
			
	}

	ExchangeSubmitButon()
	{
		if (this.form['to_currency'] == this.form['from_currency'])
		{
			this.AlertToast('Two currencies must be different.','error_form');
		}
		else
		{
			if (parseFloat(this.string_amount) <= 0)
			{
				this.AlertToast('Please enter the currency conversion number','error_form');
			}
			else
			{
				this.SubmitEx()
			}
		}
	}


	SubmitEx() {
	  let alert = this.alertCtrl.create({
	    title: 'Confirm Exchange',
	    cssClass:'prompt_alert_customer exchange',
	    enableBackdropDismiss : false,
	    message: '<div class"contentpaymentpopup">' +
  			'<p class="" text-center>Do you want to exchange '+this.string_amount+' '+this.form['from_currency']+' to '+this.form['to_currency']+'?</p>' +
  			
  		'</div>', 
	    inputs: [
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
	          
	        }
	      },
	      {
	        text: 'OK',
	        handler: data => {
	        	
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

				  	this.AccountServer.ExchangeSubmit(this.customer_id,this.form['from_currency'],this.form['to_currency'],parseFloat(this.string_amount),data.password_transaction)
			        .subscribe((data) => {
						if (data.status == 'complete')
						{
					  		
	            			loading.dismiss();
	            			this.AlertToast('The conversion process was successfuly','success_form');

	            			this.from_balance = (parseFloat(this.from_balance) - parseFloat(this.string_amount)).toFixed(8);

	            			let form_usd = this.price_from * parseFloat(this.string_amount);
							let to_coin_exchange = (form_usd/this.price_to).toFixed(8);

	            			this.to_balance = (parseFloat(this.to_balance) + parseFloat(to_coin_exchange)*0.9975).toFixed(8);
	            			this.string_amount = '0';
	            			this.string_estimate = '0';
	            			
						}
						else
						{
							this.AlertToast(data.message,'error_form');
							
			          		loading.dismiss();
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
	    ]
	  });
	  alert.present();
	}

	SubmitForm() {
		
		if (this.form['to_currency'] == this.form['from_currency'])
		{
			this.AlertToast('Two currencies must be different.','error_form');
		}
		else
		{
			if (this.form['amount'] == null || this.form['amount'] === "")
			{
				this.AlertToast('Please enter the currency conversion number','error_form');
			}
			else
			{	
				if (this.form['password_transaction'] == null || this.form['password_transaction'] === "")
				{
					this.AlertToast('Please enter the Transaction Password','error_form');
				}
				else
				{
					const confirm = this.alertCtrl.create({
				      title: 'Confirm exchange?',
				      message: 'Do you want to exchange '+this.form['amount']+' '+this.form['from_currency']+' to '+this.form['to_currency']+'?',
				      buttons: [
				        {
				          text: 'Cancel',
				          handler: () => {
				            console.log('Disagree clicked');
				          }
				        },
				        {
				          text: 'Confirm',
				          handler: () => {
				          	

				          	let loadingss = this.loadingCtrl.create({
						    	content: 'Please wait...'
						  	});
						  	loadingss.present();
				          		
			            	this.AccountServer.ExchangeSubmit(this.customer_id,this.form['from_currency'],this.form['to_currency'],parseFloat(this.form['amount']),this.form['password_transaction'])
					        .subscribe((data) => {
								if (data.status == 'complete')
								{
							  		
			            			loadingss.dismiss();
			            			this.AlertToast('The conversion process was successfuly','success_form');

			            			this.from_balance = (parseFloat(this.from_balance) - parseFloat(this.form['amount'])).toFixed(8);

			            			let form_usd = this.price_from * parseFloat(this.form['amount']);
									let to_coin_exchange = (form_usd/this.price_to).toFixed(8);

			            			this.to_balance = (parseFloat(this.to_balance) + parseFloat(to_coin_exchange)*0.9975).toFixed(8);
			            			this.form['estimate'] = '';
			            			this.form['amount'] = '';
			            			this.form['password_transaction'] = '';
									
								}
								else
								{
									this.AlertToast(data.message,'error_form');
									
					          		loadingss.dismiss();
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
				      ]
				    });
				    confirm.present();
				}
					
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
