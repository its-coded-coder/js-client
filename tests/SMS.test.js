import { SMS } from '../src/services/SMS.js';
import { AuthManager } from '../src/auth/AuthManager.js';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    post: jest.fn(),
    get: jest.fn()
  }))
}));

describe('SMS Service', () => {
  let authManager;
  let sms;

  beforeEach(() => {
    authManager = new AuthManager('test-access-key', 'test-secret-key');
    sms = new SMS(authManager);
  });

  describe('sendSms', () => {
    test('should send SMS to single recipient', async () => {
      const mockResponse = {
        successful: true,
        request_id: 123456,
        code: 100,
        message: 'Message Submitted Successfully',
        valid: 1,
        invalid: 0,
        duplicates: 0
      };

      // Mock the HTTP client post method
      sms.httpClient.post = jest.fn().mockResolvedValue(mockResponse);

      const result = await sms.sendSms('Test message', '255123456789');

      expect(result).toEqual(mockResponse);
      expect(sms.httpClient.post).toHaveBeenCalledWith(
        'https://apisms.beem.africa/v1/send',
        {
          source_addr: 'INFO',
          schedule_time: '',
          encoding: 0,
          message: 'Test message',
          recipients: [
            {
              recipient_id: 1,
              dest_addr: '255123456789'
            }
          ]
        }
      );
    });

    test('should send SMS to multiple recipients', async () => {
      const mockResponse = {
        successful: true,
        request_id: 123456,
        valid: 2,
        invalid: 0,
        duplicates: 0
      };

      sms.httpClient.post = jest.fn().mockResolvedValue(mockResponse);

      const recipients = ['255123456789', '255987654321'];
      const result = await sms.sendSms('Bulk message', recipients);

      expect(result).toEqual(mockResponse);
      expect(sms.httpClient.post).toHaveBeenCalledWith(
        'https://apisms.beem.africa/v1/send',
        {
          source_addr: 'INFO',
          schedule_time: '',
          encoding: 0,
          message: 'Bulk message',
          recipients: [
            { recipient_id: 1, dest_addr: '255123456789' },
            { recipient_id: 2, dest_addr: '255987654321' }
          ]
        }
      );
    });

    test('should send SMS with custom sender ID', async () => {
      const mockResponse = { successful: true };
      sms.httpClient.post = jest.fn().mockResolvedValue(mockResponse);

      await sms.sendSms('Test', '255123456789', { senderId: 'MYAPP' });

      const callArgs = sms.httpClient.post.mock.calls[0][1];
      expect(callArgs.source_addr).toBe('MYAPP');
    });

    test('should send SMS with schedule time', async () => {
      const mockResponse = { successful: true };
      sms.httpClient.post = jest.fn().mockResolvedValue(mockResponse);

      const scheduleTime = '2025-06-18 10:00:00';
      await sms.sendSms('Test', '255123456789', { scheduleTime });

      const callArgs = sms.httpClient.post.mock.calls[0][1];
      expect(callArgs.schedule_time).toBe(scheduleTime);
    });

    test('should throw error for empty message', async () => {
      await expect(
        sms.sendSms('', '255123456789')
      ).rejects.toThrow('Message should be a non-empty string');
    });

    test('should throw error for empty recipients', async () => {
      await expect(
        sms.sendSms('Test message', null)
      ).rejects.toThrow('Recipients should not be empty');
    });

    test('should throw error for invalid recipient type', async () => {
      await expect(
        sms.sendSms('Test message', 123)
      ).rejects.toThrow('Recipients should be either a string or an array of strings');
    });
  });

  describe('getBalance', () => {
    test('should get balance successfully', async () => {
      const mockResponse = { balance: 100.50 };
      sms.httpClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await sms.getBalance('TESTSENDER');

      expect(result).toEqual(mockResponse);
      expect(sms.httpClient.get).toHaveBeenCalledWith(
        'https://apisms.beem.africa/v1/vendors/balance?vendor_id=TESTSENDER'
      );
    });

    test('should use default sender ID when none provided', async () => {
      const mockResponse = { balance: 100.50 };
      sms.httpClient.get = jest.fn().mockResolvedValue(mockResponse);

      await sms.getBalance();

      expect(sms.httpClient.get).toHaveBeenCalledWith(
        'https://apisms.beem.africa/v1/vendors/balance?vendor_id=INFO'
      );
    });
  });

  describe('authorization', () => {
    test('should throw error when not authorized', async () => {
      const unauthorizedAuth = new AuthManager();
      const unauthorizedSms = new SMS(unauthorizedAuth);

      await expect(
        unauthorizedSms.sendSms('Test', '255123456789')
      ).rejects.toThrow('Please authorize with access key and secret key first');
    });
  });
});