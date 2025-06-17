import { HttpClient } from '../utils/HttpClient.js';

const USSD_BALANCE_URL = 'https://apitopup.beem.africa/v1/credit-balance';

export class USSD {
  constructor(authManager) {
    this.authManager = authManager;
    this.httpClient = new HttpClient(authManager);
  }

  /**
   * Get balance for USSD service
   * @param {string} appName - App name (default: 'USSD')
   * @returns {Promise<Object>} Balance information
   */
  async getBalance(appName = 'USSD') {
    if (!this.authManager.isAuthorized()) {
      throw new Error('Please authorize with access key and secret key first');
    }

    try {
      return await this.httpClient.get(`${USSD_BALANCE_URL}?app_name=${appName}`);
    } catch (error) {
      throw new Error(`Failed to get USSD balance: ${error.message}`);
    }
  }
}