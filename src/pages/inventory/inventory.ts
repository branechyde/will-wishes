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
  public wordpressUrl = 'http://willwishes.uk';
	public random: number;
  posts: any;
  post: any;
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
  signatureImage : any;
  user: any;
  clone: any;
  title: any;
  public n: number = 1;

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
      //get clone parameter
      this.clone = navParams.get('clone');
      //get post object
      this.post = navParams.get('post');

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
 
  //used to be onviewenter() 
  ngOnInit() {
    this.images = [];
    this.photos = [];
    this.filenames = [];
    this.getID();
    
    if (!this.clone) { 
     this.getStoreData(); 
     this.title = 'Create';
    } else {
      if (this.clone == 3) {
       this.title = 'Add to';
      } else {
        this.title = 'Clone';
      }
    }
  }

  // Get tag if exist or generate a new one
  getID() {
   if (this.clone == 1) { //clone new portfolio
        this.session = this.generateRandomValue(200000, 1000000);
        this.data.slug = this.session;
        this.data.name = this.post.acf.client_name;
        this.data.dob = this.post.acf.date_of_birth;
        this.data.preparedby = this.post.acf.prepared_by;
        this.data.address = this.post.acf.address;
        this.data.city = this.post.acf.city;
        this.data.postcode = this.post.acf.postcode;
        this.data.assetname = this.post.title.rendered;
        this.data.description = this.post.acf.description;
        this.data.bequeathedto = this.post.acf.asset_bequeathed_to;

    } else if (this.clone == 2) { //clone into current portfolio/ client fields will be disabled
        this.Readonly = true; 
        this.data.slug = this.post.tags[0];
        //Set other cloned variables
        this.data.name = this.post.acf.client_name;
        this.data.dob = this.post.acf.date_of_birth;
        this.data.preparedby = this.post.acf.prepared_by;
        this.data.address = this.post.acf.address;
        this.data.city = this.post.acf.city;
        this.data.postcode = this.post.acf.postcode;
        this.data.assetname = this.post.title.rendered;
        this.data.description = this.post.acf.description;
        this.data.bequeathedto = this.post.acf.asset_bequeathed_to;

     } else if (this.clone == 3) { //Add Asset to existing portfolio/ client fields will be disabled
        this.Readonly = true; 
        this.data.slug = this.post.tags[0];
        //Set other cloned variables
        this.data.name = this.post.acf.client_name;
        this.data.preparedby = this.post.acf.prepared_by;
        this.data.address = this.post.acf.address;
        this.data.city = this.post.acf.city;
        this.data.postcode = this.post.acf.postcode;
        this.data.dob = this.post.acf.date_of_birth;

    } else {
      //If there is saved tag, get it else generate a new one
      this.storage.get('session_id').then((data) => {
      this.session = data;
      //if session is null, create a new one
      if (this.session == null) {
        this.session = this.generateRandomValue(200000, 1000000);
        this.storage.set('session_id', this.session);
      } 
      //Set the tag for sending
      this.data.slug = this.session;
     });

    }
  }

  /**
   * What happens when finish button is pressed
   * Create the form with real form and set field to disabled
   */
  onFinish() {
  	if (this.Readonly == false) {
    this.storage.set('name', this.data.name);
    this.storage.set('dob', this.data.dob);
    this.storage.set('preparedby', this.data.preparedby);
    this.storage.set('address', this.data.address);
    this.storage.set('city', this.data.city);
    this.storage.set('postcode', this.data.postcode);
    }
    //send the form data
    this.sendData();
    if (this.clone == 1) { 
      //Remove current tag id
     this.storage.remove('session_id');
     //SET VALUE TO RETURN NO RESULTS FOR SEARCH
     //set storage to noresults
    }
    //Pass data and switch to viewpost
    this.navCtrl.push(ViewPosts, {signatureImage: 1});
  }
  
  //Goto Viewposts after sending the data
  Cancel() {
    this.navCtrl.push(HomePage);
   
  }

  //Store form data
  getStoreData() {
  	//Get form data from storage if it is set
    this.storage.get('name').then((data) => {
      this.data.name = data;
      if (this.data.name != null) {
       this.Readonly = true;    
      } else {
       this.Readonly = false; 
      }
    });

    this.storage.get('dob').then((data) => {
      this.data.dob = data;
    });
    this.storage.get('preparedby').then((data) => {
      this.data.preparedby = data;
    });
    this.storage.get('address').then((data) => {
      this.data.address = data;
    });
    this.storage.get('city').then((data) => {
      this.data.city = data;
    });
    this.storage.get('postcode').then((data) => {
      this.data.postcode = data;
    });
  }


  //Send form data
  sendData() {
  	let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
  	this.getStoreData();
    var link = this.wordpressUrl + '/create_portfolio.php';
    var formData = '';
    formData = JSON.stringify({uid: this.data.uid, slug: this.data.slug, name: this.data.name, preparedby: this.data.preparedby, 
    	                         assetname: this.data.assetname, description: this.data.description, address: this.data.address, 
                                city: this.data.city, postcode: this.data.postcode, dob: this.data.dob, bequeathedto: this.data.bequeathedto, images: this.filenames});
    
    this.http.post(link, formData).subscribe(data => {
      //this.data.response = data["_body"]; 
      loader.dismiss();
      this.presentToast("Portfolio Created");
    }, error => {
        console.log("Oooops!");
    });
  }
  
  /* Delete Photos */
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
            var link = this.wordpressUrl + '/delete.php';
            var myData = JSON.stringify({filename: this.data.filename});
            this.http.post(link, myData)
            .subscribe(data => {
              loader.dismiss();
              this.presentToast("Image deleted.");
              //this.data.response = data["_body"]; 
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
 
 // Take photos
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 700,
      targetHeight: 700,
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
        this.presentToast(err);
      }
    );
  }
  
 //upload photo
 uploadFile() {
   this.n += 1;
   //Generate a Tag
   //let random = this.generateRandomValue(27, 2);
   this.uid = 2; //uid used to know which folder to place image
  let Filename = this.uid + '_' + this.data.slug + '_' + this.n + 'img.jpg'
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

  fileTransfer.upload(this.imageURI, this.wordpressUrl + '/upload.php', options)
    .then((data) => {
    //path to uploaded image
    this.image = this.wordpressUrl + "/upload/file" + this.uid + "/" + Filename;
    this.images.push(this.image);
    //save filename into array
    this.filenames.push(Filename);
    loader.dismiss();
    this.presentToast("Image uploaded successfully ");
  }, (err) => {
    loader.dismiss();
    this.presentToast(err);
  });
}

//Create Toast
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
