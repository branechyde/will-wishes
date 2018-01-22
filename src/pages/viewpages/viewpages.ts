import { Component, OnInit } from '@angular/core';
import { NavController, App, NavParams, LoadingController } from 'ionic-angular';
import { WordpressService } from '../services/wordpress.service';

import { SinglePage } from '../singlepage/singlepage';



@Component({
  selector: 'page-viewpages',
  templateUrl: 'viewpages.html',
   providers: [ WordpressService ]
})
export class ViewPages implements OnInit  {
	posts: any;
    pages: any;
  constructor(private navController: NavController, 
  			  private loadingController: LoadingController, 
  			  public app: App, 
  			  public navParams: NavParams, 
  			  private wordpressService: WordpressService) {}

  ngOnInit() {
		this.getPages();
	}
   /*
	getPages() {
		let loader = this.loadingController.create({
			content: "Please wait"
		});

		loader.present();
		return this.http.get(this.wordpressApiUrl+'/wp-json/wp/v2/pages')
	    .map(result => result.json()).subscribe(data => {
	    this.pages = data; 
	     },
			error => console.log(error),
	    () => loader.dismiss());
	}
	*/
	getPages() {
		let loader = this.loadingController.create({
			content: "Please wait"
		});

		loader.present();
		this.wordpressService.getPages()
		.subscribe(data => {
			this.pages = data;
		},
		error => console.log(error), () => loader.dismiss());
	}

	loadPage(page) {
		this.navController.push(SinglePage, {
			page: page
		});
	}

}
