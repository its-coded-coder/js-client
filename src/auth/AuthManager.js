export class AuthManager {
  constructor(accessKey = null, secretKey = null) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
  }

  /**
   * Set credentials
   * @param {string} accessKey - Access key
   * @param {string} secretKey - Secret key
   */
  setCredentials(accessKey, secretKey) {
    if (typeof accessKey !== 'string' || typeof secretKey !== 'string') {
      throw new TypeError('Both accessKey and secretKey should be strings');
    }
    
    this.accessKey = accessKey;
    this.secretKey = secretKey;
  }

  /**
   * Check if credentials are set
   * @returns {boolean}
   */
  isAuthorized() {
    return !!(this.accessKey && this.secretKey);
  }

  /**
   * Get authorization header for API requests
   * @returns {Object} Headers object with authorization
   */
  getHeaders() {
    if (!this.isAuthorized()) {
      throw new Error(`
        You need to set the value of accessKey and secretKey
        
        Do this to setup:
        
        const beem = new BeemAfrica();
        beem.authorize('your-access-key', 'your-secret-key');
        
        OR
        
        const beem = new BeemAfrica('your-access-key', 'your-secret-key');
      `);
    }

    const credentials = `${this.accessKey}:${this.secretKey}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedCredentials}`
    };
  }

  /**
   * Decorator function to ensure authentication before API calls
   * @param {Function} fn - Function to wrap
   * @returns {Function} Wrapped function
   */
  secured(fn) {
    return (...args) => {
      if (!this.isAuthorized()) {
        throw new Error(`
          You need to set the value of accessKey and secretKey
          
          Do this to setup:
          
          const beem = new BeemAfrica();
          beem.authorize('your-access-key', 'your-secret-key');
        `);
      }
      return fn.apply(this, args);
    };
  }
}