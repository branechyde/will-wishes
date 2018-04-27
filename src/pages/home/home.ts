import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Login } from '../login/login';
import { InventoryPage } from '../inventory/inventory';
import { Welcome} from '../welcome/welcome';
import { ViewPosts } from '../viewposts/viewposts';
import { WordpressService } from '../services/wordpress.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ WordpressService ],
})
export class HomePage {
  public signatureImage : any;
  user: any;
  //session: any;
  search: string;
  assetbtn: boolean;

  constructor(
    private navParams: NavParams,
    private wordpressService: WordpressService,
    private storage: Storage,
    public navCtrl: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    ) {
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
    this.navCtrl.setRoot(InventoryPage);
  }

  addAssets() {
    //take us to inventory page
    this.navCtrl.push(InventoryPage);
  }

  logout() {
    this.user = undefined;
    this.storage.remove('wordpress.user');
    this.navCtrl.setRoot(Welcome);
  }

  searchPosts() {
    let loader = this.loadingController.create({
    content: "Please wait", duration: 6000
    });
    loader.present();
      //if a search is entered 
      if (this.search != null) {
        this.navCtrl.setRoot(ViewPosts, {search: this.search});
        loader.dismiss();
      } else {
       loader.dismiss();
     // prompt for input
      let toast = this.toastController.create({
          message: "Enter Client name or Portfolio ID",
          duration: 6000,
          position: 'bottom'
        });
       toast.present();
     }
  }

  

  createQuery() {
  	let query = {};
  	if(this.search) {
  	 	query['search'] = this.search;
  	}
  	return query;
  }

}
