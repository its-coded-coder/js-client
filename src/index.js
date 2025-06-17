/**
 * Beem Africa JavaScript Client
 * A JavaScript library to ease the integration with the Beem Africa SMS Gateway
 */

import { AuthManager } from './auth/AuthManager.js';
import { SMS } from './services/SMS.js';
import { OTP } from './services/OTP.js';
import { AirTime } from './services/AirTime.js';
import { TwowaySMS } from './services/TwowaySMS.js';
import { USSD } from './services/USSD.js';
import { Bpay } from './services/Bpay.js';

/**
 * Main Beem Africa client class
 */
class BeemAfrica {
  constructor(accessKey = null, secretKey = null) {
    this.auth = new AuthManager(accessKey, secretKey);
    
    // Initialize services with auth manager
    this.sms = new SMS(this.auth);
    this.otp = new OTP(this.auth);
    this.airtime = new AirTime(this.auth);
    this.twowaySms = new TwowaySMS(this.auth);
    this.ussd = new USSD(this.auth);
    this.bpay = new Bpay(this.auth);
  }

  /**
   * Authorize the client with access key and secret key
   * @param {string} accessKey - Your Beem Africa access key
   * @param {string} secretKey - Your Beem Africa secret key
   */
  authorize(accessKey, secretKey) {
    this.auth.setCredentials(accessKey, secretKey);
    return this;
  }

  /**
   * Check if the client is authorized
   * @returns {boolean}
   */
  isAuthorized() {
    return this.auth.isAuthorized();
  }
}

// For backwards compatibility and convenience
const Authorize = (accessKey, secretKey) => {
  const client = new BeemAfrica(accessKey, secretKey);
  return client;
};

// Export individual services for direct import
export {
  BeemAfrica,
  Authorize,
  SMS,
  OTP,
  AirTime,
  TwowaySMS,
  USSD,
  Bpay,
  AuthManager
};

// Default export
export default BeemAfrica;