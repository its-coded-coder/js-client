import { HttpClient } from '../utils/HttpClient.js';

const TWOWAYSMS_BALANCE_URL = 'https://www.blsmsgw.com/portal/api/userAccountBalance';

export class TwowaySMS {
  constructor(authManager) {
    this.authManager = authManager;
    this.httpClient = new HttpClient(authManager);
  }

  /**
   * Get balance for two-way SMS
   * @returns {Promise<Object>} Balance information
   */
  async getBalance() {
    if (!this.authManager.isAuthorized()) {
      throw new Error('Please authorize with access key and secret key first');
    }

    try {
      return await this.httpClient.get(TWOWAYSMS_BALANCE_URL);
    } catch (error) {
      throw new Error(`Failed to get two-way SMS balance: ${error.message}`);
    }
  }
}