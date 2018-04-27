import { Component, Input, Output, EventEmitter } from '@angular/core';
/*import { Keyboard } from '@ionic-native/keyboard';*/
import { Events } from 'ionic-angular';
import { WizardAnimations } from './ion-simple-wizard-animations';
import { ViewPosts } from '../viewposts/viewposts';
import { HomePage} from '../home/home';
import {  NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'ion-simple-wizard',
  templateUrl: 'ion-simple-wizard.component.html',
  animations: WizardAnimations.btnRotate
})
export class IonSimpleWizard {
  @Input() finishIcon = 'eye';//Default
  @Input() showSteps: boolean=true;//Default
  @Input() step = 1;//Default
  @Output() finish = new EventEmitter();
  @Output() stepChange = new EventEmitter();
  public steps = 0;//Innitial
  public hideWizard = false;//Default
  @Input() stepCondition = true;//Default
   disabled:any;

  constructor(public evts: Events, private storage: Storage,
             public navCtrl: NavController ) {
  
  }

  ngOnInit() {
    /**
     * Hide the wizard buttons when the keyboard is open
     */
    /*this.keyboard.onKeyboardShow().subscribe(() => {
      this.hideWizard = true;
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.hideWizard = false;
    })*/
  }
  /**
   * @return {number} New Steps
   */
  public addStep() {
    const newSteps = this.steps + 1;
    this.steps = newSteps;
    return newSteps;
  }
  /**
   * @return {boolean} true if is the final step
   */
  isOnFinalStep() {
    return this.step === this.steps;
  }
  /**
   * @return {boolean} the current step condition
   */
  getCondition() {
    return this.stepCondition;
  }
  /**
   * @return {boolean} true if the the step is the first 
   */
  isOnFirstStep() {
    return this.step === 1;
  }
  /**
   * @method back button event and emit Event Called 'step:back'
   */
  back() {
    this.stepChange.emit(this.step - 1);
    this.evts.publish('step:back');

  }
  /**
   * @method next button event and emit  Event Called 'step:next'
   */
  next() {
    this.stepChange.emit(this.step + 1);
    this.evts.publish('step:next');
    //get if fields are empty
    this.storage.get('error').then((data) => {
      if (data == 0) {
       //disable field
       this.disabled = true;
      } else {
        this.disabled = false;
      } 
    });
    
  }

  


}
