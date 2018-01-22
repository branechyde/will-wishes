import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { WordpressService } from '../services/wordpress.service';
import { SinglePost } from '../singlepost/singlepost';
import {SignaturePage} from '../signature/signature';

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
	public signatureImage : any;

	constructor(
		private navParams: NavParams,
		private wordpressService: WordpressService,
		private navController: NavController,
		private loadingController: LoadingController,
		private toastController: ToastController,
		public modalController:ModalController
		) { }

	ngOnInit() {
		this.category = this.navParams.get('category');
		this.tag = this.navParams.get('tag');
		this.author = this.navParams.get('author');
		this.hideSearchbar = true;
		this.search = '';
		this.favoritePosts = [];
		this.getPosts();
	}

	getPosts() {
		this.pageCount = 1;
		let query = this.createQuery();
		let loader = this.loadingController.create({
			content: "Please wait",
      duration: 10000
		});

		loader.present();
		this.wordpressService.getPosts(query)
		.subscribe(result => {
			this.posts = result;
			loader.dismiss();
		});
	}

	getAuthorPosts(author) {
		this.author = author;
		this.getPosts();
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

	toggleSearchbar() {
		this.hideSearchbar = !this.hideSearchbar;
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
   
   //open signature pad
   openSignatureModel(){
    setTimeout(() => {
       let modal = this.modalController.create(SignaturePage);
    modal.present();
    }, 300);
   }
}
