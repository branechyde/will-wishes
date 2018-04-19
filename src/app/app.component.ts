import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Welcome } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { InventoryPage } from '../pages/inventory/inventory';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
//import { ViewPages } from '../pages/viewpages/viewpages';
import { SinglePage } from '../pages/singlepage/singlepage';
import { ViewPosts } from '../pages/viewposts/viewposts';
import { SinglePost } from '../pages/singlepost/singlepost';
import { editAsset } from '../pages/editasset/editasset';



export interface PageInterface {
  title: string;
  component: any;
  index?: number;
  icon: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Welcome;

  pages: Array<{title: string, component: any, index: number, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, index: 0,icon: 'home' },
      //{ title: 'About', component: AboutPage, index: 1, icon: 'person' },
      { title: 'Create Portfolio', component: InventoryPage, index: 2, icon: 'bookmarks' },
      { title: 'Log Out', component: ViewPosts, index: 3, icon: 'person' },
      //{ title: 'Settings', component: AboutPage, index: 4, icon: 'cog' },
      //{ title: 'Contact', component: ContactPage, index: 5, icon: 'contact' },
     // { title: 'List Pages', component: ViewPages, index: 6, icon: 'plane' },
  
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  

  /* 
  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.component) {
        return 'energy';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.title) {
      return 'energy';
    }
  }
  */
}
