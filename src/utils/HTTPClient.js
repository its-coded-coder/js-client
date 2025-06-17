import axios from 'axios';

export class HttpClient {
  constructor(authManager) {
    this.authManager = authManager;
    
    // Create axios instance with default config
    this.client = axios.create({
      timeout: 30000, // 30 seconds timeout
      headers: {
        'User-Agent': 'BeemAfrica-JS-Client/1.0.0'
      }
    });

    // Add request interceptor to include auth headers
    this.client.interceptors.request.use(
      (config) => {
        const authHeaders = this.authManager.getHeaders();
        config.headers = { ...config.headers, ...authHeaders };
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          throw new Error(
            'Connection to Beem Africa API refused. Please check your internet connection'
          );
        }
        
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(
            `API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`
          );
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error(
            'No response received from Beem Africa API. Please check your internet connection'
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error(`Request Error: ${error.message}`);
        }
      }
    );
  }

  /**
   * Make a GET request
   * @param {string} url - The URL to request
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response data
   */
  async get(url, params = {}) {
    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make a POST request
   * @param {string} url - The URL to request
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  async post(url, data = {}) {
    try {
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make a PUT request
   * @param {string} url - The URL to request
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  async put(url, data = {}) {
    try {
      const response = await this.client.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make a DELETE request
   * @param {string} url - The URL to request
   * @returns {Promise<Object>} Response data
   */
  async delete(url) {
    try {
      const response = await this.client.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}