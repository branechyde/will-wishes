import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
import {SignaturePage2} from '../signature2/signature2';
import {HomePage} from '../home/home';
import { ViewPosts } from '../viewposts/viewposts';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',
})
export class SignaturePage {
  @ViewChild(SignaturePad) public signaturePad : SignaturePad;

  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200

  };
  public signatureImage : string;
  public random: number;
  public uid: any;
  public slug: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public viewCtrl: ViewController,
    private transfer: FileTransfer, public toastCtrl: ToastController, private storage: Storage) {

    this.storage.get('session_id').then((data) => {
        this.slug = data;
      });
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
    this.viewCtrl.dismiss();
    //this.navCtrl.setRoot(ViewPosts, {search: this.slug });
  }

   drawComplete() {
    this.signatureImage = this.signaturePad.toDataURL();
    this.uploadFile(this.signatureImage, this.slug);
    this.navCtrl.setRoot(SignaturePage2, {signatureImage: this.signatureImage});
  }

  drawClear() {
    this.signaturePad.clear();
  }
 
 //upload signature to server
 uploadFile(signature, slug) {
   let random = this.generateRandomValue(27, 2);
   this.uid = 2; //user id
  let Filename = slug+'_1_'+random + 'sig.png'
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

  fileTransfer.upload(signature, 'http://willwishes.uk/addsignature.php', options)
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
