import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

let apiUrl = "http://bartcleaningservices.co.uk/api.php";
//let apiUrl = 'https://api.thewallscript.com/restful/';

@Injectable()
export class AuthService {

  constructor(public http: Http) {
    console.log('Hello AuthService Provider');
  }

  postData(credentials, type){

    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.http.post(apiUrl, JSON.stringify(credentials), {headers: headers})
      .subscribe(res => {
        //display output
        //this.res.response = data["_body"];

        resolve(res.json());
      }, (err) =>{
        reject(err);
        console.log("Oooops!");
      });

    });

  }

}