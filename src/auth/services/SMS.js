import { HttpClient } from '../utils/HttpClient.js';

const BASE_SMS_URL = 'https://apisms.beem.africa/v1/send';
const BASE_BALANCE_URL = 'https://apisms.beem.africa/v1/vendors/balance';

export class SMS {
  constructor(authManager) {
    this.authManager = authManager;
    this.httpClient = new HttpClient(authManager);
    this.defaultSenderId = 'INFO';
  }

  /**
   * Send SMS to single or multiple recipients
   * @param {string} message - The message to send
   * @param {string|Array<string>} recipients - Phone number(s) to send to
   * @param {Object} options - Additional options
   * @param {string} options.senderId - Sender ID (default: 'INFO')
   * @param {string} options.scheduleTime - Schedule time for the message
   * @returns {Promise<Object>} Response from API
   */
  async sendSms(message, recipients, options = {}) {
    if (!this.authManager.isAuthorized()) {
      throw new Error('Please authorize with access key and secret key first');
    }

    if (!message || typeof message !== 'string') {
      throw new TypeError('Message should be a non-empty string');
    }

    if (!recipients) {
      throw new TypeError('Recipients should not be empty');
    }

    const requestBody = this._buildRequestBody(message, recipients, options);

    try {
      return await this.httpClient.post(BASE_SMS_URL, requestBody);
    } catch (error) {
      throw new Error(`SMS sending failed: ${error.message}`);
    }
  }

  /**
   * Get SMS balance for a sender ID
   * @param {string} senderId - Sender ID to check balance for
   * @returns {Promise<Object>} Balance information
   */
  async getBalance(senderId = null) {
    if (!this.authManager.isAuthorized()) {
      throw new Error('Please authorize with access key and secret key first');
    }

    const vendorId = senderId || this.defaultSenderId;

    try {
      return await this.httpClient.get(`${BASE_BALANCE_URL}?vendor_id=${vendorId}`);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  /**
   * Build request body for SMS API
   * @private
   * @param {string} message - Message content
   * @param {string|Array<string>} recipients - Recipients
   * @param {Object} options - Additional options
   * @returns {Object} Request body
   */
  _buildRequestBody(message, recipients, options) {
    let recipientsList;

    if (typeof recipients === 'string') {
      recipientsList = [{
        recipient_id: 1,
        dest_addr: recipients
      }];
    } else if (Array.isArray(recipients)) {
      recipientsList = recipients.map((recipient, index) => ({
        recipient_id: index + 1,
        dest_addr: recipient
      }));
    } else {
      throw new TypeError('Recipients should be either a string or an array of strings');
    }

    return {
      source_addr: options.senderId || this.defaultSenderId,
      schedule_time: options.scheduleTime || '',
      encoding: 0,
      message: message,
      recipients: recipientsList
    };
  }

  /**
   * Send SMS with custom sender ID
   * @param {string} message - The message to send
   * @param {string|Array<string>} recipients - Phone number(s) to send to
   * @param {string} senderId - Custom sender ID
   * @param {string} scheduleTime - Optional schedule time
   * @returns {Promise<Object>} Response from API
   */
  async sendSmsWithSenderId(message, recipients, senderId, scheduleTime = '') {
    return this.sendSms(message, recipients, { senderId, scheduleTime });
  }

  /**
   * Schedule SMS for later delivery
   * @param {string} message - The message to send
   * @param {string|Array<string>} recipients - Phone number(s) to send to
   * @param {string} scheduleTime - When to send the message
   * @param {string} senderId - Optional sender ID
   * @returns {Promise<Object>} Response from API
   */
  async scheduleSms(message, recipients, scheduleTime, senderId = null) {
    return this.sendSms(message, recipients, { senderId, scheduleTime });
  }
}