import { Component } from '@angular/core';
import {  NavController, AlertController, LoadingController, ToastController, App, NavParams } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service/auth-service";
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http'; 
import 'rxjs/add/operator/map';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { SinglePost } from '../singlepost/singlepost';
import { InventoryPage } from '../inventory/inventory';
import { WordpressService } from '../services/wordpress.service';

@Component({
  selector: 'page-editasset',
  templateUrl: 'editasset.html',
})
export class editAsset {
  public wordpressUrl = 'http://willwishes.uk';
  public random: number;
  post: any;
  pages: any;
  imageURI:any;
  image:any;
  //capture image
  public photos: any;
  public images: any;
  public filenames: any;
  public post_id: any;
  public tagID: any;
  
  data:any = {};
  showDelete: any;

  Name: any;
  Dob: any;
  Preparedby: any;
  Address: any;
  City: any;
  Postcode: any;
  public featuredImage: any;
  public assetImage1: any;
  public assetImage2: any;
  public assetImage3: any;
  edit: boolean = null;

	constructor(
		public navCtrl: NavController, 
	    public app: App, 
	    public navParams: NavParams, 
	    private storage: Storage,
	    public http: Http, 
	    public alertCtrl: AlertController, 
	    private camera: Camera, 
	    public authService: AuthService, 
	    private transfer: FileTransfer,
        private wordpressService: WordpressService,
	    private loadingCtrl: LoadingController,
	    public toastCtrl: ToastController) {
 
  		this.post = navParams.get('post');
  		this.edit = false;
	}

  ionViewWillEnter() {
    this.getPost(this.post.id);
    this.data.uid = '';
    this.data.name = this.post.acf.client_name;
    this.data.preparedby = this.post.acf.prepared_by;
    this.data.address = this.post.acf.address;
    this.data.city = this.post.acf.city;
    this.data.postcode = this.post.acf.postcode;
    this.data.assetname = this.post.title.rendered;
    this.data.description = this.post.acf.description;
    this.data.dob = this.post.acf.date_of_birth;
    this.data.bequeathedto = this.post.acf.asset_bequeathed_to;
    this.data.response = '';
    this.data.index = '';
  }


  getPost(id) {
    let loader = this.loadingCtrl.create({
      content: "Please wait"
    });

    loader.present();
    this.wordpressService.getPost(id)
    .subscribe(result => {
      this.post = result;
    },
    error => console.log(error),() => loader.dismiss());
  }


  ngOnInit() {
    this.images = [];
    this.filenames = [];
    this.post_id = this.post.id;
    //get featured image
    if (this.post.featured_image) {
    	this.featuredImage = this.post.featured_image;
    }
    //Get asset image 1
    if (this.post.acf.asset_image1 || this.post.asset_image1) {
    	let str = this.post.acf.asset_image1;
    	if (str.length > 5) { //it is not a number
    	 this.assetImage1 = this.post.acf.asset_image1;
    	} else {
         this.assetImage1 = this.post.asset_image1;
    	}
    }
    //get asset image 2
    if (this.post.acf.asset_image2 || this.post.asset_image2) {
    	let str = this.post.acf.asset_image2;
    	if (str.length > 5) { //if its not a number
    	 this.assetImage2 = this.post.acf.asset_image2;
    	} else {
         this.assetImage2 = this.post.asset_image2;
    	}
    }
    //get asset image 3
    if (this.post.acf.asset_image3 || this.post.asset_image3) {
    	let str = this.post.acf.asset_image3;
    	if (str.length > 5) {
    	 this.assetImage3 = this.post.acf.asset_image3;
    	} else {
         this.assetImage3 = this.post.asset_image3;
    	}
    }
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
            //post filename to our server
           this.data.index = index;
            var link = this.wordpressUrl + '/delete_image.php';
            //send filename to be deleted
            var myData = JSON.stringify({index: this.data.index, post_id: this.post_id});
            this.http.post(link, myData)
            .subscribe(data => {
              loader.dismiss();
              this.presentToast("Image deleted.");
               //determine which image should be deleted
               if (index == 0) {
                this.featuredImage = null;
               } else if (index == 1) {
                 this.assetImage1 = null;
               } else if (index == 2){
                this.assetImage2 = null;
               } else if (index == 3) {
                this.assetImage3= null;
               }
            }, error => {
                this.presentToast("Oooops! Can't delete file");
            });
          }
        }
      ]
    });
    confirm.present();
  }

//Choose which to use, camera, image gallery
chooseMedia(index) {
  let actionSheet = this.alertCtrl.create({
      title: 'Select New Image Source ',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, index);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, index);
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

  public takePicture(sourceType, index) {
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
        this.uploadFile(index);
      },
      err => {
        console.log(err);
        this.presentToast(err);
      }
    );
  }
  
 //upload file
 uploadFile(index) {
  let random = this.generateRandomValue(27, 2);
  let Filename = this.post_id + '_' + index + '_' + random + 'image.jpg'
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

  fileTransfer.upload(this.imageURI, this.wordpressUrl + '/edit_image.php', options)
    .then((data) => {
    //determine which image should be replaced
   	if (index == 0) {
   	 this.featuredImage = this.wordpressUrl + "/upload/file2"  + "/" + Filename;
   	} else if (index == 1) {
       this.assetImage1 = this.wordpressUrl + "/upload/file2" + "/" + Filename;
   	} else if (index == 2){
   	 this.assetImage2 = this.wordpressUrl + "/upload/file2" + "/" + Filename;
   	} else if (index == 3) {
   	 this.assetImage3= this.wordpressUrl + "/upload/file2" + "/" + Filename;
   	}

    loader.dismiss();
    this.presentToast("Image uploaded successfully ");
  }, (err) => {
    loader.dismiss();
    this.presentToast(err);
  });
}

//post data to update post
sendData() {
    let loader = this.loadingCtrl.create({
              content: "Saving..."
            });
    loader.present();
    var link = this.wordpressUrl + '/edit_asset.php';
    var myData = JSON.stringify({ post_id: this.post.id, tagID: this.post.tags, name: this.data.name, preparedby: this.data.preparedby, 
                               assetname: this.data.assetname, description: this.data.description, address: this.data.address, 
                                city: this.data.city, postcode: this.data.postcode, dob: this.data.dob, bequeathedto: this.data.bequeathedto});
    this.http.post(link, myData)
    .subscribe(data => {
      this.data.response = data["_body"]; 
       loader.dismiss();
      this.presentToast("Your changes have been saved. ");
    }, error => {
        loader.dismiss();
        this.presentToast(error);
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
 
saveEdit(post) {
 //send the form data
 this.sendData();
}

cancelEdit(post) {
 this.navCtrl.push(SinglePost, {post: post});
}

toggle() {
 //this.stepCondition = !this.stepCondition;
 this.showDelete = !this.showDelete;
}
  
onClicked(toggle){
  if(this.edit==true){
  }
  this.edit = toggle;
}
 


  /**
    *
    * Generates a random numeric value
    *
    * @public
    * @method generateRandomValue
    * @param min     {Number}       Minimum numeric value
    * @param max     {Number}       Maximum numeric value
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
