import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Login } from '../login/login';
import { ContactPage } from '../contact/contact';
import { InventoryPage } from '../inventory/inventory';
import { Welcome} from '../welcome/welcome';
import { ViewPosts } from '../viewposts/viewposts';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public signatureImage : any;
  user: any;
  //session: any;
  search: string;
  assetbtn: boolean;

  constructor(
    private navParams: NavParams,
    private storage: Storage,
    public navCtrl: NavController) {
    this.user = navParams.get('user');
    this.signatureImage = navParams.get('signatureImage');
    this.showAssetBtn();
  }
  
  //Show Add Asset button if form data was stored
  showAssetBtn() {
    this.storage.get('name').then((data) => {
      //if client name is set
      if (data != null) {
        this.assetbtn = true;
      } else {
        this.assetbtn = false;
      }
    });
  }
  //create new inventory
  createPortfolio() {
    //Remove stored variables
    this.storage.remove('session_id');
    this.storage.remove('name');
    this.storage.remove('dob');
    this.storage.remove('preparedby');
    this.storage.remove('address');
    this.storage.remove('city');
    this.storage.remove('postcode');
    //take us to inventory page
    this.navCtrl.push(InventoryPage);
  }

  addAssets() {
    //take us to inventory page
    this.navCtrl.push(InventoryPage);
  }

  viewLast() {
    this.navCtrl.push(ViewPosts);
  }
  
  login() {
    this.navCtrl.push(Login);
  }

  logout() {
    this.user = undefined;
    this.storage.remove('wordpress.user');
    this.navCtrl.setRoot(Welcome);
  }

  searchPosts() {
  	let query = this.createQuery();
     this.navCtrl.push(ViewPosts, {search: this.search});
  }

  createQuery() {
	let query = {};
	if(this.search) {
	 	query['search'] = this.search;
	}
	return query;
	}

}
