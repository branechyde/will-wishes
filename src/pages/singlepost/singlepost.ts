import { Component } from '@angular/core';
import {  NavController, LoadingController, AlertController, ToastController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { WordpressService } from '../services/wordpress.service';
import { InventoryPage } from '../inventory/inventory';
import { editAsset } from '../editasset/editasset';

@Component({
  selector: 'page-singlepost',
  templateUrl: 'singlepost.html',
  //providers: [ WordpressService ]
})
export class SinglePost {
	post: any;
    authorData: any;
    comments = [];

	constructor(
			public navCtrl: NavController, 
			private navParams: NavParams,
			public alertCtrl: AlertController, 
			public toastCtrl: ToastController,
			private wordpressService: WordpressService,
			private loadingController: LoadingController,
			private iab: InAppBrowser,
			private socialSharing: SocialSharing
		) {
		//get post object
		//if (navParams.get('post')) {
			this.post = navParams.get('post');
		//}
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
  }
 
  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }
 
  ionViewDidEnter() {
    this.getPost(this.post.id);
  }
 
  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }
  ionViewWillUnload() {
    console.log('ionViewWillUnload');
  }

  getPost(id) {
  	let loader = this.loadingController.create({
			content: "Please wait"
		});

		loader.present();
		this.wordpressService.getPost(id)
		.subscribe(result => {
			this.post = result;
		},
		error => console.log(error),() => loader.dismiss());
	}
	
  //Clone Portfolio/Asset
  cloneAsset() {
  let actionSheet = this.alertCtrl.create({
      title: 'Clone What?',
      buttons: [
        {
          text: 'Portfolio',
          handler: () => {
    		this.navCtrl.push(InventoryPage, { post: this.post, clone: 1 });
          }
        },
        {
          text: 'Asset',
          handler: () => {
    		this.navCtrl.push(InventoryPage, { post: this.post, clone: 2 });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

	previewPost() {
		const browser = this.iab.create(this.post.link, '_blank');
		browser.show();
	}

	sharePost() {
		let subject = this.post.title.rendered;
		let message = this.post.content.rendered;
		message = message.replace(/(<([^>]+)>)/ig,"");
		let url = this.post.link;
		this.socialSharing.share(message, subject, '', url);	
	}

   editAsset() {
     this.navCtrl.push(editAsset, { post: this.post });
   }


}
