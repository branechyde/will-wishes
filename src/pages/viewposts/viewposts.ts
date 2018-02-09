import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { WordpressService } from '../services/wordpress.service';
import { SinglePost } from '../singlepost/singlepost';
import {SignaturePage} from '../signature/signature';
import { Storage } from '@ionic/storage';
import { HomePage} from '../home/home';

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
	search: string;
	hideSearchbar: boolean;
	favoritePosts: any;
	public tagID : number;
	slug : any;
	noresults : any;

	constructor(
		private navParams: NavParams,
		private wordpressService: WordpressService,
		private navController: NavController,
		private loadingController: LoadingController,
		private toastController: ToastController,
		public modalController:ModalController,
		private storage: Storage,
		) { }

	ngOnInit() {
		this.category = this.navParams.get('category');
		this.tag = this.navParams.get('tag');
		this.author = this.navParams.get('author');
		this.hideSearchbar = true;
		//this.noresults = false;
		this.search = '';
		this.favoritePosts = [];
		this.search = this.navParams.get('search');
        //Get posts tagged with slug
		this.storage.get('session_id')
	    .then((data) => {
	      //if no search is entered use the store session id
	      if (this.search != null) {
	      	this.getTagID(this.search);
	      } else {
	      if (data != null) {
	      	this.getTagID(data);
	      }
	     }
	      
	    });
       
	}
    
    //get the tagid of the tagname
	getTagID(slug) {
		this.wordpressService.getTagID(slug)
		.subscribe(data => {
		// if a result is returned
         if (typeof data !== 'undefined' && data.length > 0) {
         this.tagID = data[0].id;
         this.getTaggedPosts(this.tagID);
         //save the current tag name, so if the portfolio is signed the correct tag is used to sign the signatures
         this.storage.set('session_id', slug);
         } else { this.noresults = 1;}
		});
	}
	//Get only tagged post
	getTaggedPosts(tagID) {
		let loader = this.loadingController.create({
			content: "Please wait",
        duration: 500
		});
		loader.present();
		this.wordpressService.getPostsbytag(tagID)
		.subscribe(result => {
			this.posts = result;
			loader.dismiss();
		});
	}

	getPosts() {
		this.pageCount = 1;
		let query = this.createQuery();
		let loader = this.loadingController.create({
			content: "Please wait",
      duration: 500
		});
		loader.present();
		this.wordpressService.getPosts(query)
		.subscribe(result => {
			this.posts = result;
			loader.dismiss();
		});
	}

	searchPosts() {
    	this.getPosts();
	}

	loadMore(infiniteScroll) {
		this.pageCount++;
		let query = this.createQuery();
	  	let loader = this.loadingController.create({
			content: "Please wait"
		});
		let toast = this.toastController.create({
			message: "There are no more posts.",
      duration: 2000
		});

		loader.present();
		this.wordpressService.getPosts(query)
		.subscribe(result => {
			infiniteScroll.complete();
			if(result.length < 1) { 
				infiniteScroll.enable(false);
				toast.present();
			} else {
				this.posts = this.posts.concat(result);
			}
		},
		error => console.log(error),() => loader.dismiss());
	}

	loadPost(post) {
		this.navController.push(SinglePost, {
			post: post
		});
	}

	createQuery() {
	let query = {};
	query['page'] = this.pageCount;
	if(this.search) {
	 	query['search'] = this.search;
	}
	if(this.category) {
		query['categories'] = this.category.id;
	}
	if(this.tag) {
		query['tags'] = this.tag.id;
	}
	if(this.author) {
		query['author'] = this.author;
	}
	return query;
	}

	backHome() {
		//remove the session id
		//this.storage.remove('session_id');
		this.navController.push(HomePage);
	}
   
   //open signature pad
   openSignatureModel(){
    setTimeout(() => {
       let modal = this.modalController.create(SignaturePage);
    modal.present();
    }, 300);
   }
}
