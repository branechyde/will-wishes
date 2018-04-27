import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { WordpressService } from '../services/wordpress.service';
import { SinglePost } from '../singlepost/singlepost';
import { SignaturePage} from '../signature/signature';
import { Storage } from '@ionic/storage';
import { HomePage} from '../home/home';
import { InventoryPage } from '../inventory/inventory';

@Component({
  selector: 'page-viewposts',
  templateUrl: 'viewposts.html',
   providers: [ WordpressService ],
})
export class ViewPosts implements OnInit  {
	posts: any;
	pageCount: number;
	category: any;
	tag: any;
	author: any;
	noresults : any;
	search: string;
	hideSearchbar: boolean;
	favoritePosts: any;
	public tagID: number;
	slug: any;
	Name: any;
  	Dob: any;
  	Preparedby: any;
  	Address: any;
  	City: any;
  	Postcode: any;

	constructor(
		private navParams: NavParams,
		private wordpressService: WordpressService,
		private navController: NavController,
		private loadingController: LoadingController,
		private toastController: ToastController,
		public modalController:ModalController,
		private storage: Storage,
		) { }
    //On page load
	ngOnInit() {
		//this.tag = this.navParams.get('tag');
		this.search = this.navParams.get('search');
	}

	//on backbutton return 
   ionViewWillEnter() {
      	this.getTagID(this.search);
    }
 

    //Retrieve post by tagID
    getTagID(slug) {
      let loader = this.loadingController.create({
			content: "Please wait...", duration: 12000
	  });
      loader.present();
      //search by portfolio id
      this.wordpressService.getTagID(slug).subscribe(data => {
      // if a result is returned
         if (typeof data !== 'undefined' && data.length > 0) {
           this.tagID = data[0].id;
           this.getTaggedPosts(this.tagID);
           //save the current tag name, so if the portfolio is signed
           // the correct tag is used to sign the signatures
           this.storage.set('session_id', slug);
         } else { 
            //search by clientname 
            this.wordpressService.getPostsbyName(this.search).subscribe(result => {
             if (typeof result !== 'undefined' && result.length > 0) {
                   this.getTaggedPosts( result[0].id);
                   this.storage.set('session_id', result[0].slug);
                  } else { this.noresults = 1;}
             });
         }
         loader.dismiss();
    });
   }
	//Get only tagged post 
	getTaggedPosts(tagID) {
		 let loader = this.loadingController.create({
			content: "Searching...", duration: 12000
		});
        loader.present();
		this.wordpressService.getPostsbytag(tagID)
		.subscribe(result => {
			this.posts = result;
			this.Name = result[0].acf.client_name;
			this.Dob = result[0].acf.date_of_birth;
			this.Preparedby = result[0].acf.prepared_by;
			this.Address = result[0].acf.address;
			this.City = result[0].acf.city;
			this.Postcode = result[0].acf.postcode;
			loader.dismiss();
		});
	}
   
    //Display a single post
	loadPost(post) {
		this.navController.push(SinglePost, { post: post });
	}

	backHome() {
		//remove the session id
		//this.storage.remove('session_id');
		this.navController.setRoot(HomePage);
	}

    //Determine what action should be taken by inventory page
	addAssets(post) {
    this.navController.setRoot(InventoryPage, { post: post, clone: 3 });
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
    this.navController.setRoot(InventoryPage);
  }
   
   //open signature pad
   openSignatureModel(){
    setTimeout(() => {
    let modal = this.modalController.create(SignaturePage);
    modal.present(); }, 300);
   }

}
