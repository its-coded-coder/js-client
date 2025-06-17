import { HttpClient } from '../utils/HttpClient.js';

const BASE_OTP_URL = 'https://apiotp.beem.africa/v1/request';
const BASE_VERIFY_URL = 'https://apiotp.beem.africa/v1/verify';

export class OTP {
  constructor(authManager) {
    this.authManager = authManager;
    this.httpClient = new HttpClient(authManager);
  }

  /**
   * Send OTP to a recipient
   * @param {string} recipient - Phone number to send OTP to
   * @param {number} appId - Your Beem App ID
   * @param {Object} options - Additional options
   * @param {number} options.length - OTP length (default: 6)
   * @param {number} options.expiry - Expiry time in minutes (default: 5)
   * @returns {Promise<Object>} Response containing pinId and message status
   */
  async sendOtp(recipient, appId, options = {}) {
    if (!this.authManager.isAuthorized()) {
      throw new Error('Please authorize with access key and secret key first');
    }

    if (!recipient || typeof recipient !== 'string') {
      throw new TypeError('Recipient number should be a non-empty string');
    }

    if (!appId || typeof appId !== 'number') {
      throw new TypeError('App ID should be a number');
    }

    const requestBody = {
      msisdn: recipient,
      appId: appId,
      ...(options.length && { length: options.length }),
      ...(options.expiry && { expiry: options.expiry })
    };

    try {
      return await this.httpClient.post(BASE_OTP_URL, requestBody);
    } catch (error) {
      throw new Error(`OTP sending failed: ${error.message}`);
    }
  }

  /**
   * Verify OTP
   * @param {string} pinId - Pin ID received from sendOtp response
   * @param {string} pin - PIN entered by user
   * @returns {Promise<Object>} Verification response
   */
  async verify(pinId, pin) {
    if (!this.authManager.isAuthorized()) {
      throw new Error('Please authorize with access key and secret key first');
    }

    if (!pinId || typeof pinId !== 'string') {
      throw new TypeError('Pin ID should be a non-empty string');
    }

    if (!pin || typeof pin !== 'string') {
      throw new TypeError('PIN should be a non-empty string');
    }

    const requestBody = {
      pinId: pinId,
      pin: pin
    };

    try {
      return await this.httpClient.post(BASE_VERIFY_URL, requestBody);
    } catch (error) {
      throw new Error(`OTP verification failed: ${error.message}`);
    }
  }

  /**
   * Send OTP with custom settings
   * @param {string} recipient - Phone number to send OTP to
   * @param {number} appId - Your Beem App ID
   * @param {number} length - Length of OTP (4-8 digits)
   * @param {number} expiry - Expiry time in minutes
   * @returns {Promise<Object>} Response containing pinId and message status
   */
  async sendCustomOtp(recipient, appId, length = 6, expiry = 5) {
    return this.sendOtp(recipient, appId, { length, expiry });
  }

  /**
   * Verify OTP and return boolean result
   * @param {string} pinId - Pin ID received from sendOtp response
   * @param {string} pin - PIN entered by user
   * @returns {Promise<boolean>} True if verification successful, false otherwise
   */
  async verifyOtp(pinId, pin) {
    try {
      const response = await this.verify(pinId, pin);
      
      // Check if the verification was successful based on response structure
      // Adjust this based on actual API response format
      return response?.data?.message?.code === 117 || 
             response?.message?.code === 117 ||
             response?.code === 117;
    } catch (error) {
      // If there's an error, verification failed
      return false;
    }
  }
}