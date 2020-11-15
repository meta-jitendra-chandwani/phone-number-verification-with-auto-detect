import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SendOtpResponse } from 'app/model/sendOtpResponse';
import { OtpService } from 'app/otp.service';
import { AlertService } from 'app/services/alert.service';
import { Subject } from 'rxjs';
declare var SMSReceive: any;
@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  @Input() isShownOn;
  @Output() sendToParent = new EventEmitter();
  verificationForm: FormGroup
  otpForm: FormGroup
  allowNumbersOnly = true;
  sessionId;
  submitted = false;
  input = {
    mobile: 10,
    otp: 6
  }
  constructor(private formBuilder: FormBuilder, private otpService: OtpService,
    private alertService: AlertService
  ) {
    this.verificationForm = this.formBuilder.group({
      phoneNumber: ['', Validators.required]
    });

    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.required]
    });

  }
  ngOnInit() {

  }


  get verificationFormController() {
    return this.verificationForm.controls;
  }

  get otpFormController() {
    return this.otpForm.controls;
  }

  onPhoneNumberChange(event) {
    this.verificationFormController.phoneNumber.setValue(event);
  }

  onOtpChange(event) {
    this.otpFormController.otp.setValue(event);
  }

  sendOtp() {
    this.submitted = true;
    if (this.verificationForm.invalid) {
      return;
    }
    this.otpService.sendOtpToNumber(this.verificationFormController.phoneNumber.value).subscribe((response: SendOtpResponse) => {
      if (response && response.Status === "Success") {
        this.sessionId = response.Details;
        this.alertService.presentToast("Otp sent successfully", 'top', 3000);
        this.isShownOn = 'verify';
        this.sendToParent.emit(this.isShownOn)
        this.start();
      }
    }, error => {
      if (error && error.error && error.error.Status == "Error") {
        this.alertService.presentToast(error.error.Details, 'top', 3000);
      }
    });
  }

  verifyOtp() {
    this.otpService.verityOtp(this.sessionId, this.otpFormController.otp.value).subscribe((response: SendOtpResponse) => {
      if (response && response.Status === "Success") {
        this.alertService.presentToast(response.Details, 'top', 3000);
      }
    }, error => {
      if (error && error.error && error.error.Status == "Error") {
        this.alertService.presentToast(error.error.Details, 'top', 3000);
      }
    });
  }
  detectedOtp: Subject<void> = new Subject<void>();

  start() {
    SMSReceive.startWatch(
      () => {
        console.log('watch started');
        document.addEventListener('onSMSArrive', (e: any) => {
          console.log('onSMSArrive()');
          var incomingSMS = e.data.body;
          let incomingSmsArray = incomingSMS.split(" ");
          this.detectedOtp.next(incomingSmsArray[0]);
          this.otpFormController.otp.setValue(incomingSmsArray[0]);
          SMSReceive.stopWatch(
            () => { console.log('watch stopped') },
            () => { console.log('watch stop failed') }
          )
        });
      },
      () => { console.log('watch start failed') }
    )
  }

  changeNumber() {
    this.isShownOn = 'home';
    this.sendToParent.emit(this.isShownOn)
  }
}
