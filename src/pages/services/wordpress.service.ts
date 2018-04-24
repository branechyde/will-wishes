import { Injectable } from '@angular/core';
import { Response, RequestOptions, Headers, Http} from '@angular/http';
//import { Config } from '../../app/app.config';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class WordpressService {
   public tagID : any;
   public wordpressApiUrl = 'http://willwishes.uk/wp-json';
   //public wordpressApiUrl = 'https://julienrenaux.fr/wp-json';
   public token: any;

	constructor(private http: Http,
		        private storage: Storage,
		        ) {}

	public signup(data) {
		let url = 'http://willwishes.uk/create_user.php';
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
  
  //Get all posts
	public getPostsbyName(name) {
		this.storage.get('token').then((data) => {
			this.token = data;
			console.log('here is your token ' + this.token); 
	    }); 
		let headers = new Headers();
	    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	    headers.append('Accept', 'application/json');
	    headers.append('Authorization', 'Bearer ' + this.token);
    	let options = new RequestOptions({ headers: headers });
		let url = this.wordpressApiUrl + `/chenko/v2/my_meta_query?meta_query[0][key]=client_name&meta_query[0][value]=${name}`;
		return this.http.get(url, options)
	  	.map(result => {
			return result.json();
		  });  
		  
	}

	//get post by query
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
		this.storage.get('token').then((data) => {
			this.token = data;
			console.log('here is your token ' + this.token); 
	    }); 
		let headers = new Headers();
	    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	    headers.append('Accept', 'application/json');
	    headers.append('Authorization', 'Bearer ' + this.token);
    	let options = new RequestOptions({ headers: headers });
		let url = this.wordpressApiUrl + `/wp/v2/posts?tags=${id}&per_page=100`;
		return this.http.get(url,options)
	  	.map(result => {
			return result.json();
		});    
	}
    //Get the id of a tag by its slug
	public getTagID(slug) {
	  this.storage.get('token').then((data) => {
			this.token = data;
			console.log('here is your token ' + this.token); 
	    }); 
		let headers = new Headers();
	    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	    headers.append('Accept', 'application/json');
	    headers.append('Authorization', 'Bearer ' + this.token);
    	let options = new RequestOptions({ headers: headers });
	  let url = this.wordpressApiUrl + `/wp/v2/tags?slug=${slug}`;
      return this.http.get(url, options)
      .map(result => {
			return result.json();
	  });    
   }
   //get a single post
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