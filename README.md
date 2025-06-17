# Beem Africa JavaScript Client

A JavaScript/Node.js library to ease the integration with the Beem Africa SMS Gateway.

[![npm version](https://badge.fury.io/js/beem-africa.svg)](https://badge.fury.io/js/beem-africa)
[![Downloads](https://img.shields.io/npm/dm/beem-africa.svg)](https://www.npmjs.com/package/beem-africa)

## Features

- [x] SMS (Single and Bulk)
- [x] OTP (One Time Password)
- [x] AirTime Transfer
- [x] Two-way SMS
- [x] USSD
- [x] Bpay

## Getting Started

### Installation

```bash
npm install beem-africa
```

Or with yarn:

```bash
yarn add beem-africa
```

### Authentication

Before making any API calls, you need to authorize your app with your access key and secret key obtained from the [Beem Africa website](https://beem.africa).

#### Method 1: Initialize with credentials

```javascript
import BeemAfrica from 'beem-africa';

const beem = new BeemAfrica('your-access-key', 'your-secret-key');
```

#### Method 2: Authorize after initialization

```javascript
import BeemAfrica from 'beem-africa';

const beem = new BeemAfrica();
beem.authorize('your-access-key', 'your-secret-key');
```

#### Method 3: Using the Authorize function (backwards compatibility)

```javascript
import { Authorize } from 'beem-africa';

const beem = Authorize('your-access-key', 'your-secret-key');
```

## SMS Service

### Sending a Single SMS

```javascript
try {
  const response = await beem.sms.sendSms(
    'Hello from Beem Africa!', 
    '255xxxxxxxxxx'
  );
  
  console.log(response);
  // Output: { successful: true, request_id: 35918915, code: 100, message: 'Message Submitted Successfully', valid: 1, invalid: 0, duplicates: 0 }
} catch (error) {
  console.error('Error sending SMS:', error.message);
}
```

### Sending SMS with Custom Sender ID

```javascript
const response = await beem.sms.sendSms(
  'You are now verified!',
  '255xxxxxxxxxx',
  { senderId: 'MYAPP' }
);
```

### Scheduling SMS

```javascript
const response = await beem.sms.sendSms(
  'Your appointment reminder',
  '255xxxxxxxxxx',
  { 
    senderId: 'CLINIC',
    scheduleTime: '2025-06-18 10:00:00'
  }
);
```

### Sending Bulk SMS

```javascript
const recipients = ['255xxxxxxxx1', '255xxxxxxxx2', '255xxxxxxxx3'];

const response = await beem.sms.sendSms(
  'Bulk message to multiple recipients',
  recipients
);
```

### Checking SMS Balance

```javascript
try {
  const balance = await beem.sms.getBalance('YOUR_SENDER_ID');
  console.log('SMS Balance:', balance);
} catch (error) {
  console.error('Error getting balance:', error.message);
}
```

## OTP Service

### Sending OTP

```javascript
try {
  const response = await beem.otp.sendOtp('255xxxxxxxxxx', 12345); // 12345 is your app ID
  
  console.log('OTP Response:', response);
  // Save the pinId for verification
  const pinId = response.data.pinId;
} catch (error) {
  console.error('Error sending OTP:', error.message);
}
```

### Sending OTP with Custom Settings

```javascript
const response = await beem.otp.sendCustomOtp(
  '255xxxxxxxxxx',
  12345,      // App ID
  6,          // OTP length
  10          // Expiry in minutes
);
```

### Verifying OTP

```javascript
try {
  const verificationResponse = await beem.otp.verify(
    'pin-id-from-send-response',
    '123456'  // OTP entered by user
  );
  
  console.log('Verification:', verificationResponse);
  // { data: { message: { code: 117, message: 'Valid Pin' } } }
} catch (error) {
  console.error('OTP verification failed:', error.message);
}
```

### Simple Boolean OTP Verification

```javascript
const isValid = await beem.otp.verifyOtp('pin-id', '123456');
console.log('OTP is valid:', isValid); // true or false
```

## AirTime Service

### Transferring AirTime

```javascript
try {
  const response = await beem.airtime.transferAirtime('255xxxxxxxxxx', 1000);
  
  console.log('Transfer Response:', response);
  // { code: 200, transaction_id: 1619484193194, message: 'Disbursement is in progress' }
} catch (error) {
  console.error('AirTime transfer failed:', error.message);
}
```

### Transfer with Custom Reference

```javascript
const response = await beem.airtime.transferAirtimeWithReference(
  '255xxxxxxxxxx',
  1000,
  'REF-123456'
);
```

### Bulk AirTime Transfer

```javascript
const transfers = [
  { recipient: '255xxxxxxxx1', amount: 1000, reference: 'REF-001' },
  { recipient: '255xxxxxxxx2', amount: 2000, reference: 'REF-002' },
  { recipient: '255xxxxxxxx3', amount: 1500 }
];

const results = await beem.airtime.bulkTransfer(transfers);
console.log('Bulk transfer results:', results);
```

### Checking AirTime Balance

```javascript
try {
  const balance = await beem.airtime.getCreditBalance();
  console.log('Credit Balance:', balance);
  // { data: { credit_bal: '708.0357' } }
} catch (error) {
  console.error('Error getting balance:', error.message);
}
```

## Other Services

### Two-way SMS Balance

```javascript
const balance = await beem.twowaySms.getBalance();
```

### USSD Balance

```javascript
const balance = await beem.ussd.getBalance();
```

### Bpay Balance

```javascript
const balance = await beem.bpay.getBalance();
```

## TypeScript Support

This library includes TypeScript definitions. You can use it in TypeScript projects without additional setup:

```typescript
import BeemAfrica from 'beem-africa';

const beem = new BeemAfrica('access-key', 'secret-key');

// TypeScript will provide full type checking and autocomplete
const response: any = await beem.sms.sendSms('Hello', '255xxxxxxxxxx');
```

## Error Handling

All methods return Promises and may throw errors. Always wrap your API calls in try-catch blocks:

```javascript
try {
  const response = await beem.sms.sendSms('Hello', '255xxxxxxxxxx');
  console.log('Success:', response);
} catch (error) {
  if (error.message.includes('Connection')) {
    console.error('Network error:', error.message);
  } else if (error.message.includes('authorize')) {
    console.error('Authentication error:', error.message);
  } else {
    console.error('API error:', error.message);
  }
}
```

## Usage with Different Module Systems

### ES6 Modules (Recommended)

```javascript
import BeemAfrica, { SMS, OTP, AirTime } from 'beem-africa';
```

### CommonJS

```javascript
const BeemAfrica = require('beem-africa').default;
const { SMS, OTP, AirTime } = require('beem-africa');
```

### Using Individual Services

```javascript
import { SMS } from 'beem-africa';
import { AuthManager } from 'beem-africa';

const auth = new AuthManager('access-key', 'secret-key');
const sms = new SMS(auth);

await sms.sendSms('Hello', '255xxxxxxxxxx');
```

## API Reference

### BeemAfrica Class

- `constructor(accessKey?, secretKey?)` - Initialize client
- `authorize(accessKey, secretKey)` - Set credentials
- `isAuthorized()` - Check if credentials are set

### SMS Service

- `sendSms(message, recipients, options?)` - Send SMS
- `getBalance(senderId?)` - Get SMS balance
- `sendSmsWithSenderId(message, recipients, senderId, scheduleTime?)` - Send with custom sender
- `scheduleSms(message, recipients, scheduleTime, senderId?)` - Schedule SMS

### OTP Service

- `sendOtp(recipient, appId, options?)` - Send OTP
- `verify(pinId, pin)` - Verify OTP
- `sendCustomOtp(recipient, appId, length, expiry)` - Send with custom settings
- `verifyOtp(pinId, pin)` - Boolean verification

### AirTime Service

- `transferAirtime(recipient, amount, options?)` - Transfer airtime
- `getCreditBalance(appName?)` - Get balance
- `transferAirtimeWithReference(recipient, amount, reference)` - Transfer with reference
- `bulkTransfer(transfers)` - Bulk transfer


### Development Setup

```bash
git clone https://github.com/beem-africa/js-client.git
cd js-client
npm install
npm run dev  # Start development mode
npm test     # Run tests
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/beem-africa/js-client/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact support at [Beem Africa](https://beem.africa)

## Credits

- Original Js client by [Patrick_Waithaka](https://github.com/its-coded-coder)
- JavaScript implementation by the Beem Africa team and contributors

## Changelog

### v1.0.0
- Initial release
- SMS, OTP, AirTime, USSD, Two-way SMS, and Bpay support
- TypeScript definitions
- Comprehensive error handling
- Modern ES6+ syntax