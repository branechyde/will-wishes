import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//import { Config } from '../../app/app.config';
import 'rxjs/add/operator/map';

@Injectable()
export class WordpressService {
   public tagID : any;
   public wordpressApiUrl = 'http://bartcleaningservices.co.uk/wp-json';
   //public wordpressApiUrl = 'https://julienrenaux.fr/wp-json';

	constructor(private http: Http) {}

	public signup(data) {
		let url = 'http://bartcleaningservices.co.uk/create_user.php';
		return this.http.post(url, data)
	  	.map(result => {
			return result.json();
		});    
	}

	public login(data) {
		let url = this.wordpressApiUrl + '/jwt-auth/v1/token';
		return this.http.post(url, data)
	  	.map(result => {
			return result.json();
		});    
	}

	public getPosts(query) {
		query = this.transformRequest(query);
		let url = this.wordpressApiUrl + `/wp/v2/posts?${query}&_embed`;
		return this.http.get(url)
	  	.map(result => {
			return result.json();
		});    
	}
    //Get posts by tag id
	public getPostsbytag(id) {
		let url = this.wordpressApiUrl + `/wp/v2/posts?tags=${id}&per_page=100`;
		return this.http.get(url)
	  	.map(result => {
			return result.json();
		});    
	}
    //Get the id of a tag by its slug
	public getTagID(slug) {
	  let url = this.wordpressApiUrl + `/wp/v2/tags?slug=${slug}`;
      return this.http.get(url)
      .map(result => {
			return result.json();
	  });    
   }

	public getPost(id) {
		return this.http.get(this.wordpressApiUrl + `/wp/v2/posts/${id}?_embed`)
	  	.map(result => {
			return result.json();
		});
	}

	public getMedia(id) {
		return this.http.get(this.wordpressApiUrl + `/wp/v2/media/${id}`)
	  	.map(result => {
			return result.json();
		});
	}

	public getCategories() {
		return this.http.get(this.wordpressApiUrl + '/wp/v2/categories?per_page=100')
		.map(result => {
			return result.json();
		});
	}

	public getTags() {
		return this.http.get(this.wordpressApiUrl + '/wp/v2/tags?per_page=100')
		.map(result => {
			return result.json();
		});
	}

	public getPages() {
		return this.http.get(this.wordpressApiUrl + '/wp/v2/pages?per_page=100')
		.map(result => {
			return result.json();
		});
	}

	public getPage(id) {
		return this.http.get(this.wordpressApiUrl + `/wp/v2/pages/${id}`)
	  	.map(result => {
			return result.json();
		});
	}

	public getMenus() {
		return this.http.get(this.wordpressApiUrl + '/wp-api-menus/v2/menus')
		.map(result => {
			return result.json();
		});
	}

	public getMenu(id) {
		return this.http.get(this.wordpressApiUrl + `/wp-api-menus/v2/menus/${id}`)
	  	.map(result => {
			return result.json();
		});
	}

	private transformRequest(obj) {
		let p, str;
		str = [];
		for (p in obj) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
		return str.join('&');
	}

}