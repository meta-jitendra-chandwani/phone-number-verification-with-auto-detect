import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  SimpleChanges,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { KeysPipe } from 'app/keys.pipe';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss']
})
export class OtpInputComponent implements OnInit {
  @ViewChild('input') inputElement: ElementRef;
  @Input() inputLength;
  @Input() detectedOtp?;
  @Output() onInputChange = new EventEmitter<string>();
  otpForm: FormGroup;
  inputControls: FormControl[]
  eventsSubscription
  componentKey =
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36);
  constructor(private keysPipe: KeysPipe) { }

  ngOnInit() {
    if (this.detectedOtp) {
      this.eventsSubscription = this.detectedOtp.subscribe((value) => {
        this.inputElement.nativeElement.focus();
        if (value.length == this.inputLength) {
          let otpArray = value.split("");
          for (let index = 0; index < this.inputLength; index++) {
            const element = this.otpForm.controls[this.getControlName(index)];
            element.setValue(otpArray[index])
          }
        }
      });
    }
    this.inputControls = new Array(this.inputLength);
    this.otpForm = new FormGroup({});
    for (let index = 0; index < this.inputLength; index++) {
      this.otpForm.addControl(this.getControlName(index), new FormControl());
    }

  }
  ngOnDestroy() {
    if (this.detectedOtp && this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  private getControlName(idx) {
    return `ctrl_${idx}`;
  }

  ifLeftArrow(event) {
    return this.ifKeyCode(event, 37);
  }

  ifRightArrow(event) {
    return this.ifKeyCode(event, 39);
  }

  ifBackspaceOrDelete(event) {
    return (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      this.ifKeyCode(event, 8) ||
      this.ifKeyCode(event, 46)
    );
  }

  ifKeyCode(event, targetCode) {
    const key = event.keyCode || event.charCode;
    return key == targetCode ? true : false;
  }

  onKeyDown($event) {
    var isSpace = this.ifKeyCode($event, 32)
    if (isSpace) {// prevent space
      return false;
    }
  }

  onKeyUp($event, inputIdx) {
    const nextInputId = this.appendKey(`otp_${inputIdx + 1}`);
    const prevInputId = this.appendKey(`otp_${inputIdx - 1}`);
    if (this.ifRightArrow($event)) {
      this.setSelected(nextInputId);
      return;
    }
    if (this.ifLeftArrow($event)) {
      this.setSelected(prevInputId);
      return;
    }
    const isBackspace = this.ifBackspaceOrDelete($event);
    if (isBackspace && !$event.target.value) {
      this.setSelected(prevInputId);
      this.rebuildValue();
      return;
    }
    if (!$event.target.value) {
      return;
    }
    if (this.ifValidEntry($event)) {
      this.setSelected(nextInputId);
    }
    this.rebuildValue();
  }

  appendKey(id) {
    return `${id}_${this.componentKey}`;
  }

  setSelected(eleId) {
    this.focusTo(eleId);
    const ele: any = document.getElementById(eleId);
    if (ele && ele.setSelectionRange) {
      setTimeout(() => {
        ele.setSelectionRange(0, 1);
      }, 0);
    }
  }

  ifValidEntry(event) {
    const inp = String.fromCharCode(event.keyCode);
    const isMobile = /Android/i.test(navigator.userAgent);
    return (
      isMobile ||
      /[a-zA-Z0-9-_]/.test(inp) ||
      (event.keyCode >= 96 && event.keyCode <= 105)
    );
  }

  focusTo(eleId) {
    const ele: any = document.getElementById(eleId);
    if (ele) {
      ele.focus();
    }
  }

  rebuildValue() {
    let val = '';
    this.keysPipe.transform(this.otpForm.controls).forEach(k => {
      if (this.otpForm.controls[k].value) {
        val += this.otpForm.controls[k].value;
      }
    });
    this.onInputChange.emit(val);
  }

}