import { Component } from '@angular/core';
import {  NavController, AlertController, Events, LoadingController, ToastController, App, NavParams } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service/auth-service";
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http'; 
import 'rxjs/add/operator/map';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { HomePage } from '../home/home';
import { ViewPosts } from '../viewposts/viewposts';

@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',

})
export class InventoryPage {
	public random: number;
  posts: any;
  pages: any;
  //public wordpressApiUrl = 'http://trendigadgets.com';
  //upload image
  imageURI:any;
  image:any;
  //capture image
  public photos: any;
  public images: any;
  public filenames: any;
  public uid: any;
  public tagID: any;
  session: any;
  data:any = {};
  //Multistep variables
  step: any;
  stepCondition: any;
  stepDefaultCondition: any;
  currentStep: any;
  showDelete: any;
  Readonly: boolean;
  Name: any;
  Dob: any;
  Preparedby: any;
  Address: any;
  City: any;

  signatureImage : any;
  user: any;

  constructor(
    public navCtrl: NavController, 
    public app: App, 
    public navParams: NavParams, 
    private storage: Storage,
    public http: Http, 
    public alertCtrl: AlertController, 
    public evts: Events, 
    private camera: Camera, 
    public authService: AuthService, 
    private transfer: FileTransfer,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
        this.data.uid = '';
        this.data.slug = '';
        this.data.name = '';
        this.data.preparedby = '';
        this.data.address = '';
        this.data.city = '';
        this.data.postcode = '';
        this.data.assetname = '';
        this.data.description = '';
        this.data.dob = '';
        this.data.bequeathedto = '';
        this.data.response = '';
        this.data.filename = '';
    /**
     * Step Wizard Settings
     */
    this.step = 1;//The value of the first step, always 1
    this.stepCondition = true;//Set to true if you don't need condition in every step
    this.stepDefaultCondition = this.stepCondition;//Save the default condition for every step

    //You can subscribe to the Event 'step:changed' to handle the current step
    this.evts.subscribe('step:changed', step => {
      //Handle the current step if you need
      this.currentStep = step[0];
      //Set the step condition to the default value
      this.stepCondition = this.stepDefaultCondition;
    });

    this.evts.subscribe('step:next', () => {
      //Do something if next
      console.log('Next pressed: ', this.currentStep);
    });

    this.evts.subscribe('step:back', () => {
      //Do something if back
      console.log('Back pressed: ', this.currentStep);
    });

    this.showDelete = false;
    this.Readonly = false;    
  }

  toggle() {
    //this.stepCondition = !this.stepCondition;
    this.showDelete = !this.showDelete;
  }
  
  //If required fields are not empty 
  textChange() {
    if (this.data.name !== '' && this.data.dob  !== '' && this.data.preparedby  !== '') {
      this.stepCondition = true;
    } 
  }
 

  ngOnInit() {
    this.images = [];
    this.photos = [];
    this.filenames = [];
    //this.getPages();
    //this.getData();
    this.getID();
    //get the tagid of the tagname
    //this.getTagID('E170444018962530');
    this.getStep1();  
  }

  // Get session id if exist
  getID() {
    this.storage.get('session_id')
    .then((data) => {
      this.session = data;
      //if session is null, create a new one
      if (this.session == null) {
        this.session = this.generateRandomValue(200000, 1000000);
        this.storage.set('session_id', this.session);
      } 
      this.data.slug = this.session;
    });
  }

  /**
   * What happens when finish button is pressed
   */
  onFinish() {
  	if (this.Readonly == false) {
    this.storage.set('name', this.data.name);
    this.storage.set('dob', this.data.dob);
    this.storage.set('preparedby', this.data.preparedby);
    this.storage.set('address', this.data.address);
    this.storage.set('city', this.data.city);
    }
     //send the form data
    this.sendData();
    //Pass data and switch to homepage
    this.gotoHomepage();
    //this.navCtrl.setRoot(ViewPosts, {tagID: this.tagID});
    //this.navCtrl.insert(0,HomePage);
    //this.navCtrl.popToRoot();
  }
  
  gotoHomepage() {
      this.storage.get('wordpress.user')
      .then(data => {
          if(data) {
            this.user = data;
            this.navCtrl.push(HomePage, {signatureImage: 1, user: this.user});
          }
      });
  }


  getStep1() {
    this.storage.get('name').then((data) => {
      this.Name = data;
      if (this.Name != null) {
       this.Readonly = true;    
      } else {
       this.Readonly = false; 
      }
    });
    this.storage.get('dob').then((data) => {
      this.Dob = data;
    });
    this.storage.get('preparedby').then((data) => {
      this.Preparedby = data;
    });
    this.storage.get('address').then((data) => {
      this.Address = data;
    });
    this.storage.get('city').then((data) => {
      this.City = data;
    });
  }
  

  /* 
  public getTagID(slug) {
      return this.http.get(`http://bartcleaningservices.co.uk/wp-json/wp/v2/tags?slug=${slug}`).map(result => result.json()).subscribe(data => {
      this.tagID = data[0].id;
      });
   }
  
 //Get pages from trendigadgets or from test site
 public getPages() {
    return this.http.get('https://api.myjson.com/bins/ctyoh')
    .map(result => result.json().Semester).subscribe(data => {
    this.pages = data;
    });
  }

  //Get feed from reddit
  getData() {
    return this.http.get('https://www.reddit.com/r/gifs/new/.json?limit=20').map(result => result.json()).subscribe(result => {
    this.posts = result.data.children;
    });
  }
  */

  sendData() {
  	this.getStep1();
    var link = 'http://bartcleaningservices.co.uk/api.php';
    if (this.Readonly) {
    	var myData = JSON.stringify({uid: this.data.uid, slug: this.data.slug, name: this.Name, preparedby: this.Preparedby, 
    	                         assetname: this.data.assetname, description: this.data.description, address: this.Address, 
                                city: this.City, dob: this.Dob, bequeathedto: this.data.bequeathedto});
    } else {
       var myData = JSON.stringify({uid: this.data.uid, slug: this.data.slug, name: this.data.name, preparedby: this.data.preparedby, 
    	                         assetname: this.data.assetname, description: this.data.description, address: this.data.address, 
                                city: this.data.city, postcode: this.data.postcode, dob: this.data.dob, bequeathedto: this.data.bequeathedto});
    }
    this.http.post(link, myData)
    .subscribe(data => {
      this.data.response = data["_body"]; //retrieve tag id here and pass it to next page ts
    }, error => {
        console.log("Oooops!");
    });
  }
  

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: "Sure you want to delete this photo? There is NO undo!",
      message: "",
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("Disagree clicked");
          }
        },
        {
          text: "Yes",
          handler: () => {
            let loader = this.loadingCtrl.create({
              content: "Deleting..."
            });
            loader.present();
            //post filename to our server /delete.php
           let files = this.filenames;
           let filename = files[index];
           this.data.filename = filename;
            var link = 'http://bartcleaningservices.co.uk/delete.php';
            var myData = JSON.stringify({filename: this.data.filename});
            this.http.post(link, myData)
            .subscribe(data => {
              loader.dismiss();
              this.presentToast("Image deleted.");
              this.data.response = data["_body"]; 
               //remove filename from array if successful
              this.filenames.splice(index, 1);
              this.photos.splice(index, 1);
              this.images.splice(index, 1);
            }, error => {
                //console.log("Oooops! Can't delete file");
                this.presentToast("Oooops! Can't delete file");
            });
          

           //
          }
        }
      ]
    });
    confirm.present();
  }

//Choose which to use, camera, image gallery
chooseMedia() {
  let actionSheet = this.alertCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 450,
      targetHeight: 450,
      //popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then(imageData => {
    	this.imageURI = imageData;
        //store photo uri
        this.photos.push(this.imageURI);
       
        this.photos.reverse();
        this.uploadFile();
      },
      err => {
        console.log(err);
        this.presentToast(err);
      }
    );
  }
  
 //upload file
 uploadFile() {
   let random = this.generateRandomValue(27, 2);
   this.uid = 2; //tagname
  let Filename = this.uid+'_'+random + 'ion.jpg'
  let loader = this.loadingCtrl.create({
    content: "Uploading..."
  });
  loader.present();
  const fileTransfer: FileTransferObject = this.transfer.create();

  let options: FileUploadOptions = {
    fileKey: 'file', //fileKey: 'file',
    fileName: Filename,//fileName: 'name.jpg',
    chunkedMode: true,
    mimeType: "image/jpeg",
    headers: {}
  }

  fileTransfer.upload(this.imageURI, 'http://bartcleaningservices.co.uk/upload.php', options)
    .then((data) => {
    //this.getData();
    this.image = "http://bartcleaningservices.co.uk/upload/"+ Filename+ ".jpg"
    this.images.push(this.image);
    //save filename into array
    this.filenames.push(Filename);
    loader.dismiss();
    this.presentToast("Image uploaded successfully ");
  }, (err) => {
    //console.log(err);
    loader.dismiss();
    this.presentToast(err);
  });
}

presentToast(msg) {
  let toast = this.toastCtrl.create({
    message: msg,
    duration: 1000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

 /**
    *
    * Generates a random numeric value
    *
    * @public
    * @method generateRandomValue
    * @param min     {Number}   		Minimum numeric value
    * @param max     {Number}   		Maximum numeric value
    * @return {Number}
    */
   //
  generateRandomValue(min : number, max : number) : number {
      let maxVal : number     = max,
          minVal : number     = min,
          genVal : number;
      let time : number;
      let slug : any;
      // Generate max value
      if(maxVal === 0)
      {
         maxVal = maxVal;
      }
      else {
         maxVal = 1;
      }
      // Generate min value
      if(minVal)
      {
         minVal = minVal;
      }
      else {
         minVal = 0;
      }

      genVal  = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      time = Math.floor(Date.now() / 1000);
      slug = 'E' + (genVal * time);
      return slug;
   }


}
