import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationComponent } from './verification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeysPipe } from 'app/keys.pipe';
import { OtpInputModule } from 'app/otp-input/otp-input.module';



@NgModule({
  declarations: [VerificationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    OtpInputModule
  ],
  exports: [VerificationComponent],
  providers: [KeysPipe]
})
export class VerificationModule { }
