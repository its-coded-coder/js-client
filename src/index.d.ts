export interface BeemResponse {
  successful?: boolean;
  request_id?: number;
  code?: number;
  message?: string;
  valid?: number;
  invalid?: number;
  duplicates?: number;
  [key: string]: any;
}

export interface OtpResponse {
  data: {
    pinId: string;
    message: {
      code: number;
      message: string;
    };
  };
}

export interface VerifyResponse {
  data: {
    message: {
      code: number;
      message: string;
    };
  };
}

export interface AirtimeResponse {
  code: number;
  transaction_id: number;
  message: string;
}

export interface BalanceResponse {
  data: {
    credit_bal: string;
  };
}

export interface BulkTransferResult {
  recipient: string;
  amount: number;
  success: boolean;
  data?: AirtimeResponse;
  error?: string;
}

export interface SmsOptions {
  senderId?: string;
  scheduleTime?: string;
}

export interface OtpOptions {
  length?: number;
  expiry?: number;
}

export interface AirtimeOptions {
  reference?: string;
}

export interface BulkTransfer {
  recipient: string;
  amount: number;
  reference?: string;
}

export declare class AuthManager {
  constructor(accessKey?: string, secretKey?: string);
  setCredentials(accessKey: string, secretKey: string): void;
  isAuthorized(): boolean;
  getHeaders(): { [key: string]: string };
  secured<T extends (...args: any[]) => any>(fn: T): T;
}

export declare class SMS {
  constructor(authManager: AuthManager);
  sendSms(message: string, recipients: string | string[], options?: SmsOptions): Promise<BeemResponse>;
  getBalance(senderId?: string): Promise<BalanceResponse>;
  sendSmsWithSenderId(message: string, recipients: string | string[], senderId: string, scheduleTime?: string): Promise<BeemResponse>;
  scheduleSms(message: string, recipients: string | string[], scheduleTime: string, senderId?: string): Promise<BeemResponse>;
}

export declare class OTP {
  constructor(authManager: AuthManager);
  sendOtp(recipient: string, appId: number, options?: OtpOptions): Promise<OtpResponse>;
  verify(pinId: string, pin: string): Promise<VerifyResponse>;
  sendCustomOtp(recipient: string, appId: number, length?: number, expiry?: number): Promise<OtpResponse>;
  verifyOtp(pinId: string, pin: string): Promise<boolean>;
}

export declare class AirTime {
  constructor(authManager: AuthManager);
  transferAirtime(recipient: string, amount: number, options?: AirtimeOptions): Promise<AirtimeResponse>;
  getCreditBalance(appName?: string): Promise<BalanceResponse>;
  transferAirtimeWithReference(recipient: string, amount: number, reference: string): Promise<AirtimeResponse>;
  bulkTransfer(transfers: BulkTransfer[]): Promise<BulkTransferResult[]>;
  isNetworkSupported(recipient: string): Promise<boolean>;
}

export declare class TwowaySMS {
  constructor(authManager: AuthManager);
  getBalance(): Promise<BalanceResponse>;
}

export declare class USSD {
  constructor(authManager: AuthManager);
  getBalance(appName?: string): Promise<BalanceResponse>;
}

export declare class Bpay {
  constructor(authManager: AuthManager);
  getBalance(appName?: string): Promise<BalanceResponse>;
}

export declare class BeemAfrica {
  auth: AuthManager;
  sms: SMS;
  otp: OTP;
  airtime: AirTime;
  twowaySms: TwowaySMS;
  ussd: USSD;
  bpay: Bpay;

  constructor(accessKey?: string, secretKey?: string);
  authorize(accessKey: string, secretKey: string): BeemAfrica;
  isAuthorized(): boolean;
}

export declare function Authorize(accessKey: string, secretKey: string): BeemAfrica;

export default BeemAfrica;