import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtpInputComponent } from './otp-input.component';

describe('OtpInputComponent', () => {
  let component: OtpInputComponent;
  let fixture: ComponentFixture<OtpInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpInputComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OtpInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
