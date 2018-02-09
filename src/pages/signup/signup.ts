
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
//import { Http } from '@angular/http'; //https://stackoverflow.com/questions/43609853/angular-4-and-ionic-3-no-provider-for-http
//import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { WordpressService } from '../services/wordpress.service';
import { Login } from '../login/login';
/**
 * Generated class for the Signup page.
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [ WordpressService ]
})
export class Signup {
   data:any = {};

    constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      private loadingController: LoadingController,
      private toastController: ToastController,
      private storage: Storage,
      private wordpressService: WordpressService) {
        this.data.email = '';
        this.data.password = '';
        this.data.username = '';
        this.data.response = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

  signup() {
    let loader = this.loadingController.create({
      content: "Please wait"
    });
    loader.present();
        var myData = JSON.stringify({email: this.data.email, username: this.data.username, password: this.data.password});
        this.wordpressService.signup(myData).subscribe((data) => {
          loader.dismiss();
          //console.log(data);
          this.data.response = data;
          //If account created redirect to login page
          if ( this.data.response.result == true) {
            this.navCtrl.setRoot(Login, {
              success: 'success'
            });
          }
        }, error => {
            loader.dismiss();
            //
            let errorMessage = error.json();
            if (errorMessage && errorMessage.message) {
              let message = errorMessage.message.replace(/<(?:.|\n)*?>/gm, '');
              let toast = this.toastController.create({
                message: message,
                duration: 2000,
                position: 'bottom'
              });
           }
            //
        });
  }


}
