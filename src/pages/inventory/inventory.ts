import { Component } from '@angular/core';
import {  NavController, AlertController, Events, LoadingController, ToastController, App, NavParams } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service/auth-service";
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
  data:any = {};
  //Multistep variables
  step: any;
  stepCondition: any;
  stepDefaultCondition: any;
  currentStep: any;

  constructor(public navCtrl: NavController, public app: App, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public evts: Events, private camera: Camera, public authService: AuthService, private transfer: FileTransfer,
  public loadingCtrl: LoadingController,
  public toastCtrl: ToastController) {
        this.data.uid = '';
        this.data.title = '';
        this.data.description = '';
        this.data.address = '';
        this.data.city = '';
        this.data.postcode = '';
        this.data.worth = '';
        this.data.other = '';
        this.data.response = '';
        this.http = http;
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
    
  }

  toggle() {
    this.stepCondition = !this.stepCondition;
  }
  getIconStep2() {
    return this.stepCondition ? 'unlock' : 'lock';
  }

  getIconStep3() {
    return this.stepCondition ? 'happy' : 'sad';
  }
  getLikeIcon() {
    return this.stepCondition ? 'thumbs-down' : 'thumbs-up';
  }
  goToExample2() {
   // this.navCtrl.push(DynamicPage);
  }
  
  //If there is a change in the textfield
  textChange(e) {
    if (e.target.value && e.target.value.trim() !== '') {
      this.stepCondition = true;
    } else {
      this.stepCondition = false;
    }
  }
 

  ngOnInit() {
    this.images = [];
    this.photos = [];
    this.filenames = [];
    this.getPages();
    this.getData();
  }
  /**
   * What happens when finish button is pressed
   */
  onFinish() {
    this.navCtrl.setRoot(ViewPosts);
    //send the form data
    this.sendData();
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
  
  sendData() {
    var link = 'http://bartcleaningservices.co.uk/api.php';
    var myData = JSON.stringify({uid: this.data.uid, title: this.data.title, description: this.data.description, address: this.data.address, city: this.data.city, postcode: this.data.postcode, worth: this.data.worth, other: this.data.other});
   
    this.http.post(link, myData)
    .subscribe(data => {
      this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
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
   this.uid = 2; //user id
  let Filename = this.uid+'_'+random + 'ion'
  let loader = this.loadingCtrl.create({
    content: "Uploading..."
  });
  loader.present();
  const fileTransfer: FileTransferObject = this.transfer.create();

  let options: FileUploadOptions = {
    fileKey: Filename,
    fileName: Filename,
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
    this.presentToast("Image uploaded successfully "+ Filename);
  }, (err) => {
    console.log(err);
    loader.dismiss();
    this.presentToast(err);
  });
}

presentToast(msg) {
  let toast = this.toastCtrl.create({
    message: msg,
    duration: 3000,
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
   generateRandomValue(min : number, max : number) : number
   {
      let maxVal : number     = max,
          minVal : number     = min,
          genVal : number;

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

      genVal  = minVal + (maxVal - minVal) * Math.random();

      return genVal;
   }

  






}
