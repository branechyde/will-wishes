import { Component, ViewChild } from '@angular/core';
import { NavController,  IonicPage,  App, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
import {SignaturePage} from '../signature/signature';
import {HomePage} from '../home/home';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-signature2',
  templateUrl: 'signature2.html',
})
export class SignaturePage2 {
  @ViewChild(SignaturePad) public signaturePad : SignaturePad;
 
  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 250
  };
  public signatureImage : any;
  public random: number;
  public uid: any;
  data:any = {};
  user: any;

  constructor(private navParams: NavParams, public navCtrl: NavController, public http: Http, 
  private transfer: FileTransfer, public loadingCtrl: LoadingController,
  public toastCtrl: ToastController, public app: App, private storage: Storage) { 
    this.signatureImage = navParams.get('signatureImage'); 
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    this
      .signaturePad
      .set('minWidth', 1);
      console.log(canvas.offsetWidth);
    this
      .signaturePad
      .set('canvasWidth', canvas.offsetWidth);

    this
      .signaturePad
      .set('canvasHeight', canvas.offsetHeight);
  }


   ngAfterViewInit() {
     console.log("Reset Model Screen");
      this
      .signaturePad
      .clear();
      this.canvasResize();
   }

  
  drawCancel() {
    this.navCtrl.push(SignaturePage);
  }

   drawComplete() {
    this.signatureImage = this.signaturePad.toDataURL();
    //Get slug from storage
    this.storage.get('session_id')
      .then((data) => {
        //upload file with embeded slug id/tag
        this.uploadFile(this.signatureImage, data);
      });
    //Remove current tag id
    this.storage.remove('session_id');
    this.storage.remove('name');
    this.storage.remove('dob');
    this.storage.remove('preparedby');
    this.storage.remove('address');
    this.storage.remove('city');
    //get the current user object for the homepage
    this.getUser();
  }

  drawClear() {
    this
      .signaturePad
      .clear();
  }

  getUser() {
      this.storage.get('wordpress.user')
      .then(data => {
          if(data) {
            this.user = data;
            this.navCtrl.push(HomePage, {signatureImage: this.signatureImage, user: this.user});
          }
      });
  }
  
  /* 
  addSignature() {
    var link = 'http://bartcleaningservices.co.uk/addsignature.php';
    var myData = JSON.stringify({uid: this.data.uid, tag: this.data.tag});
    this.http.post(link, myData)
    .subscribe(data => {
      this.data.response = data["_body"]; 
    }, error => {
        console.log("Oooops!");
    });
  }
  */

//upload signature to server
 uploadFile(signature, slug) {
  let random = this.generateRandomValue(27, 2);
  let Filename = slug+'_'+random + 'sig2.png'
  let loader = this.loadingCtrl.create({
    content: "Uploading..."
  });
  loader.present();
  const fileTransfer: FileTransferObject = this.transfer.create();
  let options: FileUploadOptions = {
    fileKey: 'file',
    fileName: Filename,
    chunkedMode: true,
    mimeType: "image/png",
    headers: {}
  }

  fileTransfer.upload(signature, 'http://bartcleaningservices.co.uk/addsignature.php', options)
    .then((data) => {
    loader.dismiss();
    this.presentToast("Signature uploaded successfully ");
  }, (err) => {
    console.log(err);
    loader.dismiss();
    this.presentToast(err);
  });
}

//function to show toast
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
    * @param min     {Number}       Minimum numeric value
    * @param max     {Number}       Maximum numeric value
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

