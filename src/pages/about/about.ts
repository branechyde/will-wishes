import { Component } from '@angular/core';
import { NavController, App, NavParams } from 'ionic-angular';
//import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
//import { HomePage } from '../home/home';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public app: App, public navParams: NavParams) {

  }

  logout(){
    //Api Token Logout 
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  aboutus() {
    this.navCtrl.push(AboutPage);
  }

  contactus() {
    this.navCtrl.push(ContactPage);
  }

}
