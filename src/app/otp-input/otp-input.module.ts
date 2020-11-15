import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpInputComponent } from './otp-input.component';
import { KeysPipe } from 'app/pipe/keys.pipe';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [OtpInputComponent, KeysPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [OtpInputComponent],
  providers: [KeysPipe]
})
export class OtpInputModule { }
