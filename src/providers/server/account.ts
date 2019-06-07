import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import *  as MyConfig from '../../providers/myConfig';

@Injectable()
export class AccountProvider {

	constructor(public http: Http) {
		//console.log('Hello SettingServerProvider Provider');
	}

	
  	SignupStepOne(email:string){
  		let body = {email: email};
		return this.http.post(MyConfig.data.url+'/api/signup-step-one',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}

	Signup(email:string,password_login: string,password_transaction: string,referees: string){
  		let body = {email: email,password_login: password_login,password_transaction: password_transaction,referees : referees};
		return this.http.post(MyConfig.data.url+'/api/signup-step-tow',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}

	Login(email:string,password: string){
  		let body = {email: email,password: password};
		return this.http.post(MyConfig.data.url+'/api/login',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}

	ForgotPassword(email:string,types: string){
  		let body = {email: email,types: types};
		return this.http.post(MyConfig.data.url+'/api/forgot-password',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}

	CheckCoceForgotPassword(email:string,code: string){
  		let body = {email: email,code: code};
		return this.http.post(MyConfig.data.url+'/api/check-code-forgot-password',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}

	UpdatePassword(email:string,types: string,code: string,password : string){
  		let body = {email: email,types: types,code: code,password : password};
		return this.http.post(MyConfig.data.url+'/api/update-password-forgot',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}

	GetInfomationUser(customer_id:string){
  		let body = {customer_id: customer_id};
		return this.http.post(MyConfig.data.url+'/api/get-infomation-user',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}

	GetPriceAltcoin(){
  		let body = {};
		return this.http.post(MyConfig.data.url+'/api/load-price',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}

	 GetNotificationID(_id: string){
      let body = {_id: _id};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-notification-id',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

	GetAddressUser(customer_id : string,currency: string){
  		let body = {customer_id : customer_id,currency: currency};
		return this.http.post(MyConfig.data.url+'/api/deposit/get-address',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}
	GetHisroryWallet(customer_id : string,currency: string,types,start: number, limit: number){
  		let body = {customer_id : customer_id,currency: currency,types: types,start: start, limit: limit};
		return this.http.post(MyConfig.data.url+'/api/deposit/get-history-currency',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}

	AddWalletAddress(customer_id : string,name: string,address: string,currency : string, password_transaction: string){
  		let body = {customer_id : customer_id,name: name,address: address, currency: currency,password_transaction : password_transaction};
		return this.http.post(MyConfig.data.url+'/api/deposit/add-wallet-address',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}

	GetContactCurrency(customer_id : string,currency: string){
  		let body = {customer_id : customer_id,currency: currency};
		return this.http.post(MyConfig.data.url+'/api/deposit/get-contact-currency',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}
	
	WithdrawCurrency(customer_id : string,address: string,amount : number, currency: string,password_transaction : string){
  		let body = {customer_id : customer_id,address : address,amount : amount, currency: currency, password_transaction: password_transaction};
		return this.http.post(MyConfig.data.url+'/api/deposit/withdraw-currency',body)
		.do(this.logResponse)
		.map(this.extractData)
		.catch(this.catchError)
	}
	
	ExchangeSubmit(customer_id: string,form: string, to : string, amount: number,password_transaction: string){
      let body = {customer_id: customer_id,form: form, to: to, amount : amount ,password_transaction : password_transaction };
      return this.http.post(MyConfig.data.url+'/api/exchange/submit',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }


    SubmitInvestment(customer_id: string,currency: string, amount: number,password_transaction: string){
      let body = {customer_id: customer_id,currency: currency,  amount : amount ,password_transaction : password_transaction };
      return this.http.post(MyConfig.data.url+'/api/investment/active-package',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetActiveInvestment(customer_id: string){
      let body = {customer_id: customer_id};
      return this.http.post(MyConfig.data.url+'/api/investment/get-active-invest',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    DisableInvestment(customer_id: string,currency : string){
      let body = {customer_id: customer_id,currency : currency};
      return this.http.post(MyConfig.data.url+'/api/investment/disable-package',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetHistoryInvestment(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id,start: start,limit : limit};
      return this.http.post(MyConfig.data.url+'/api/investment/get-history',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetHisroryDialing(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-history-dialing',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetNumberDialing(customer_id: string){
      let body = {customer_id: customer_id};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-number-dialing',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    UpdateDialing(customer_id: string,number_random: number){
      let body = {customer_id: customer_id,number_random:number_random};
      return this.http.post(MyConfig.data.url+'/api/exchange/update-number-dialing',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetActiveInvestmentCurrency(customer_id: string,currency : string){
      let body = {customer_id: customer_id,currency: currency};
      return this.http.post(MyConfig.data.url+'/api/investment/get-active-invest-currency',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    SubmitPayment(customer_id: string,currency : string, address: string,amount: string,password_transaction: string){
      let body = {customer_id: customer_id,currency: currency,address:address,amount: amount,password_transaction: password_transaction};
      return this.http.post(MyConfig.data.url+'/api/investment/submit-payment',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetHisroryPayment(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id,start: start,limit : limit};
      return this.http.post(MyConfig.data.url+'/api/investment/get-history-payment',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
    
    GetMember(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-member',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }


    GetHisroryExchange(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-history',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetSearchHisrory(customer_id: string,from_currency: string, to_currency : string,start : number, limit : number){
      let body = {customer_id: customer_id,from_currency : from_currency,to_currency: to_currency,  start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-search-history',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }


    GetHisroryProfit(customer_id: string,types : string,start : number, limit : number){
      let body = {customer_id: customer_id,types : types, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-history-profit',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    SupportSubmit(customer_id: string,title : string, content : string){
      let body = {customer_id: customer_id, title: title,  content: content};
      return this.http.post(MyConfig.data.url+'/api/exchange/submit-support',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }


    SupportSubmitReply(customer_id: string,_id: string, content : string){
      let body = {customer_id: customer_id, _id: _id, content: content};
      return this.http.post(MyConfig.data.url+'/api/exchange/submit-support-reply',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
    

    GetHisrorySupport(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-history-support',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetHisrorySupportID(_id: string){
      let body = {_id: _id};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-support-id',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
     
    UpdatePassword_User(customer_id:string,types: string,password: string,new_password : string){
      let body = {customer_id: customer_id,types: types,password: password,new_password : new_password};
      return this.http.post(MyConfig.data.url+'/api/update-password-user',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    SendMailVerify(customer_id: string){
      let body = {customer_id: customer_id};
      return this.http.post(MyConfig.data.url+'/api/send-mail-verify',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
    CheckCoceVerifyEmail(customer_id:string,code: string){
      let body = {customer_id: customer_id,code: code};
    return this.http.post(MyConfig.data.url+'/api/check-code-verify-email',body)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError)
  }

    Get2FACode(customer_id:string){
        let body = {customer_id: customer_id};
      return this.http.post(MyConfig.data.url+'/api/get-2fa-code',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    Enlable2FA(customer_id:string,otp_secret: string,code : string){
        let body = {customer_id: customer_id,otp_secret : otp_secret,code: code};
      return this.http.post(MyConfig.data.url+'/api/enlable-2fa',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    EnlableFingerprint(customer_id:string){
        let body = {customer_id: customer_id};
      return this.http.post(MyConfig.data.url+'/api/enlable-fingerprint',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    DisableFingerprint(customer_id:string){
        let body = {customer_id: customer_id};
      return this.http.post(MyConfig.data.url+'/api/disable-fingerprint',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    

    Disable2FA(customer_id:string,code : string){
        let body = {customer_id: customer_id,code: code};
      return this.http.post(MyConfig.data.url+'/api/disable-2fa',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }


    CheckStatus2FA(customer_id:string){
        let body = {customer_id: customer_id};
      return this.http.post(MyConfig.data.url+'/api/check-status-2fa',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    CheckCode2fA(customer_id:string,code_2fa: string){
        let body = {customer_id: customer_id,code_2fa: code_2fa};
      return this.http.post(MyConfig.data.url+'/api/check-code-2fa',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
    GetVersionApp(){
      let body = {};
      return this.http.post(MyConfig.data.url+'/api/get-version-app',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
     GetListNotification(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-notification',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
  	private catchError(error : Response){
  		//console.log(error);
  		return Observable.throw(error.json().error || "server login error");
  	}

  	private logResponse(res : Response){
  		//console.log(res);
  	}

  	private extractData(res : Response){
  		
  		return res.json();
  	}
}
