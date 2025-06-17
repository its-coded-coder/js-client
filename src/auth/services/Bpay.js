import { HttpClient } from '../utils/HttpClient.js';

const BPAY_BALANCE_URL = 'https://apitopup.beem.africa/v1/credit-balance';

export class Bpay {
  constructor(authManager) {
    this.authManager = authManager;
    this.httpClient = new HttpClient(authManager);
  }

  /**
   * Get balance for Bpay service
   * @param {string} appName - App name (default: 'BPAY')
   * @returns {Promise<Object>} Balance information
   */
  async getBalance(appName = 'BPAY') {
    if (!this.authManager.isAuthorized()) {
      throw new Error('Please authorize with access key and secret key first');
    }

    try {
      return await this.httpClient.get(`${BPAY_BALANCE_URL}?app_name=${appName}`);
    } catch (error) {
      throw new Error(`Failed to get Bpay balance: ${error.message}`);
    }
  }
}