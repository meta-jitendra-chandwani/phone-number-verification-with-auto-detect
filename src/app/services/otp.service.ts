import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../config/app.config';
@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private http: HttpClient
  ) { }

  sendOtpToNumber(phoneNumber) {
    let url = "https://2factor.in/API/V1/" + config.TWO_FACTOR_API_KEY + "/SMS/+91" + phoneNumber + "/AUTOGEN"
    return this.http.get(url);
  }

  verityOtp(sessionId, otpEntered) {
    let url = "https://2factor.in/API/V1/" + config.TWO_FACTOR_API_KEY + "/SMS/VERIFY/" + sessionId + "/" + otpEntered;
    return this.http.get(url);
  }
}
