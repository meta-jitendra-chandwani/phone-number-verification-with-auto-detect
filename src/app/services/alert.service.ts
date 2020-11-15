import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private nativeToast: ToastController,
  ) { }

  async presentToast(message, pos: any = 'top', duration = 4000) {
    const toast = await this.nativeToast.create({
      message: message,
      duration: duration,
      position: pos
    });
    toast.present();
  }
}
