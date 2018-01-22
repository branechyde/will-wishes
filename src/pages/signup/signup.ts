
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Http } from '@angular/http'; //https://stackoverflow.com/questions/43609853/angular-4-and-ionic-3-no-provider-for-http


/**
 * Generated class for the Signup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {
   data:any = {};

    constructor(public navCtrl: NavController, public http: Http, public navParams: NavParams) {
        this.data.name = '';
        this.data.password = '';
        this.data.username = '';
        this.data.response = '';
        this.http = http;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }
  
  signup() {
        var link = 'http://bartcleaningservices.co.uk/api.php';
        var myData = JSON.stringify({name: this.data.name, username: this.data.username, password: this.data.password});
        
        this.http.post(link, myData)
        .subscribe(data => {
          this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response

          //If signed up
          if(this.data.response){
          this.navCtrl.push(HomePage);
         }
        }, error => {
            console.log("Oooops!");
        });
  }

}
