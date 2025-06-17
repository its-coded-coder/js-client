import { HttpClient } from '../utils/HttpClient.js';

const TRANSFER_AIRTIME_URL = 'https://apiairtime.beem.africa/v1/transfer';
const AIRTIME_BALANCE_URL = 'https://apitopup.beem.africa/v1/credit-balance';

export class AirTime {
  constructor(authManager) {
    this.authManager = authManager;
    this.httpClient = new HttpClient(authManager);
  }

  /**
   * Transfer airtime to a mobile number
   * @param {string} recipient - Recipient mobile number
   * @param {number} amount - Amount to transfer
   * @param {Object} options - Additional options
   * @param {string} options.reference - Custom reference for the transaction
   * @returns {Promise<Object>} Transfer response with transaction details
   */
  async transferAirtime(recipient, amount, options = {}) {
    if (!this.authManager.isAuthorized()) {
      throw new Error('Please authorize with access key and secret key first');
    }

    if (!recipient || typeof recipient !== 'string') {
      throw new TypeError('Recipient number should be a non-empty string');
    }

    if (!amount || (typeof amount !== 'number' && typeof amount !== 'string')) {
      throw new TypeError('Amount should be a number or numeric string');
    }

    // Convert amount to number if it's a string
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new TypeError('Amount should be a positive number');
    }

    const requestBody = {
      dest_addr: recipient,
      amount: numericAmount,
      ...(options.reference && { reference: options.reference })
    };

    try {
      return await this.httpClient.post(TRANSFER_AIRTIME_URL, requestBody);
    } catch (error) {
      throw new Error(`Airtime transfer failed: ${error.message}`);
    }
  }

  /**
   * Get credit balance for airtime
   * @param {string} appName - App name (default: 'AIRTIME')
   * @returns {Promise<Object>} Balance information
   */
  async getCreditBalance(appName = 'AIRTIME') {
    if (!this.authManager.isAuthorized()) {
      throw new Error('Please authorize with access key and secret key first');
    }

    try {
      return await this.httpClient.get(`${AIRTIME_BALANCE_URL}?app_name=${appName}`);
    } catch (error) {
      throw new Error(`Failed to get credit balance: ${error.message}`);
    }
  }

  /**
   * Transfer airtime with custom reference
   * @param {string} recipient - Recipient mobile number
   * @param {number} amount - Amount to transfer
   * @param {string} reference - Custom reference for tracking
   * @returns {Promise<Object>} Transfer response
   */
  async transferAirtimeWithReference(recipient, amount, reference) {
    return this.transferAirtime(recipient, amount, { reference });
  }

  /**
   * Bulk airtime transfer to multiple recipients
   * @param {Array<Object>} transfers - Array of transfer objects {recipient, amount, reference?}
   * @returns {Promise<Array<Object>>} Array of transfer responses
   */
  async bulkTransfer(transfers) {
    if (!Array.isArray(transfers)) {
      throw new TypeError('Transfers should be an array');
    }

    if (transfers.length === 0) {
      throw new Error('Transfers array should not be empty');
    }

    const results = [];
    
    for (const transfer of transfers) {
      if (!transfer.recipient || !transfer.amount) {
        throw new Error('Each transfer must have recipient and amount');
      }
      
      try {
        const result = await this.transferAirtime(
          transfer.recipient, 
          transfer.amount, 
          { reference: transfer.reference }
        );
        results.push({
          recipient: transfer.recipient,
          amount: transfer.amount,
          success: true,
          data: result
        });
      } catch (error) {
        results.push({
          recipient: transfer.recipient,
          amount: transfer.amount,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Check if airtime transfer is supported for a network
   * @param {string} recipient - Mobile number to check
   * @returns {Promise<boolean>} True if supported, false otherwise
   */
  async isNetworkSupported(recipient) {
    // This is a placeholder - implement based on actual API capabilities
    // For now, assume all networks are supported
    if (!recipient || typeof recipient !== 'string') {
      return false;
    }
    
    // Basic validation for Tanzanian numbers (example)
    const tanzanianPrefixes = ['255'];
    return tanzanianPrefixes.some(prefix => recipient.startsWith(prefix));
  }
}