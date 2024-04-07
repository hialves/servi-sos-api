export interface SmsService {
  send(body: string, phone: string): Promise<{ success: boolean }>;
}
