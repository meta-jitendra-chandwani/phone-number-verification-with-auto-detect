import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isShownOn = 'home'
  constructor() {
  }

  retrieveFromChild(event) {
    this.isShownOn = event;
  }
}
