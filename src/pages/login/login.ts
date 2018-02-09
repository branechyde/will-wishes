import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { WordpressService } from '../services/wordpress.service';
import { HomePage} from '../home/home';

@Component({
  templateUrl: './login.html',
  providers: [ WordpressService ]
})
export class Login {
  success: any;
  account: {username: string, password: string} = {
    username: '',
    password: ''
  };
  
  constructor(
    private navParams: NavParams,
    private navController: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private storage: Storage,
    private wordpressService: WordpressService) { this.success = navParams.get('success'); }

  login() {
    let loader = this.loadingController.create({
      content: "Please wait"
    });
    loader.present();

    this.wordpressService.login(this.account).subscribe((result) => {
      loader.dismiss();
      this.storage.set('wordpress.user', result);
      this.navController.push(HomePage, {
        user: result
      });
    }, (error) => {
      loader.dismiss();
      let errorMessage = error.json();
      if (errorMessage && errorMessage.message) {
        let message = errorMessage.message.replace(/<(?:.|\n)*?>/gm, '');
        let toast = this.toastController.create({
          message: message,
          duration: 6000,
          position: 'bottom'
        });
        toast.present();
      }
    });
  }

}