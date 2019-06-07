import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../../pages/login/login';

import *  as MyConfig from '../../../providers/myConfig';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
@IonicPage()
@Component({
  selector: 'page-verify-account',
  templateUrl: 'verify-account.html',
})
export class VerifyAccountPage {
	infomation = {};
	customer_id : any;
	status_step_start = true;
	status_step_frontid = false;
	status_step_backid = false;
	status_step_avatart = false;
	status_step_complete = false;

	status_btn_frontid = false;
	status_btn_backid = false;
	status_btn_avatart = false;
	img_frontid = 'assets/imgs/fontside.png';
	img_backid = 'assets/imgs/backside.png';
	img_avatart = 'assets/imgs/addresss.png';

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider,
		private camera: Camera,
    	private transfer: FileTransfer
	) {
		
	}
	private fileTransfer: FileTransferObject = this.transfer.create();


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
				this.AccountServer.GetInfomationUser(this.customer_id)
		        .subscribe((data) => {
		        	loading.dismiss();	
					if (data.status == 'complete')
					{
						this.infomation = data;
						this.infomation['status_verityaccount'] = data.security.verifyaccount.status;
						
					}
					else
					{
						this.AlertToast(data.message,'error_form');
					}
				})
			}
		})
				
	}


	ClickStartStep_Show_FrontID(){
		this.status_step_start = false;
		this.status_step_frontid = true;
	}

	ClickStartStep_Up_FrontID(sourceType:number){
		this.camera.getPicture({
	        quality: 50,
	        destinationType: this.camera.DestinationType.FILE_URI,
	        sourceType: sourceType == 0 ? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.CAMERA ,
	        encodingType: this.camera.EncodingType.JPEG,
	        allowEdit : true,
	        targetWidth : 200,
	        targetHeight : 180,
	        mediaType: this.camera.MediaType.PICTURE,
			correctOrientation: true
	    }).then((imageData) => {

	    	this.img_frontid = imageData;
	    	this.status_btn_frontid = true;
	    }, (err) => {});
	}
	ClickStartStep_Show_BackID()
	{	
		let options: FileUploadOptions = {
            fileKey: "file",
            fileName: this.img_frontid.substr(this.img_frontid.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg"
        }
    	  
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();

        this.fileTransfer.upload(this.img_frontid, MyConfig.data.url+'/api/upload-img-passport-fontside/' + this.customer_id, options)
            .then((data) => {
            loading.dismiss();
            this.status_step_frontid = false;
			this.status_step_backid = true;
            
        }, (err) => {
            loading.dismiss();
            this.AlertToast('Please try again.','error_form')
        })
			
	}
	ClickStartStep_Up_BackID(sourceType:number){
		this.camera.getPicture({
	        quality: 50,
	        destinationType: this.camera.DestinationType.FILE_URI,
	        sourceType: sourceType == 0 ? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.CAMERA ,
	        encodingType: this.camera.EncodingType.JPEG,
	        allowEdit : true,
	        targetWidth : 200,
	        targetHeight : 150,
	        mediaType: this.camera.MediaType.PICTURE,
			correctOrientation: true
	    }).then((imageData) => {

	    	this.img_backid = imageData;
	    	this.status_btn_backid = true;

			
	    }, (err) => {});
		
	}

	ClickStartStep_Show_Avartar()
	{
		let options: FileUploadOptions = {
            fileKey: "file",
            fileName: this.img_backid.substr(this.img_backid.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg"
        }
    	  
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();

        this.fileTransfer.upload(this.img_backid, MyConfig.data.url+'/api/upload-img-passport-backside/' + this.customer_id, options)
            .then((data) => {
            loading.dismiss();

            this.status_step_backid = false;
			this.status_step_avatart = true;
        }, (err) => {
            loading.dismiss();
            this.AlertToast('Please try again.','error_form')
        })
			
	}

	ClickStartStep_Up_Avartar(sourceType:number){
		this.camera.getPicture({
	        quality: 50,
	        destinationType: this.camera.DestinationType.FILE_URI,
	        sourceType: sourceType == 0 ? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.CAMERA ,
	        encodingType: this.camera.EncodingType.JPEG,
	        allowEdit : true,
	        targetWidth : 200,
	        targetHeight : 150,
	        mediaType: this.camera.MediaType.PICTURE,
			correctOrientation: true
	    }).then((imageData) => {

	    	this.status_btn_avatart = true;
	    	this.img_avatart = imageData;

			
	    }, (err) => {});
		
	}

	ContinueFive()
	{
		let options: FileUploadOptions = {
            fileKey: "file",
            fileName: this.img_avatart.substr(this.img_avatart.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg"
        }
    	  
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();

        this.fileTransfer.upload(this.img_avatart, MyConfig.data.url+'/api/upload-img-address/' + this.customer_id, options)
            .then((data) => {
            loading.dismiss();
            this.status_step_avatart = false;
			this.status_step_complete = true;
        }, (err) => {
            loading.dismiss();
            this.AlertToast('Please try again.','error_form')
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
