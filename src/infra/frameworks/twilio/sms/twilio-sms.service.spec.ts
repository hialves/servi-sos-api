import { responseMessages } from '../../../../application/messages/response.messages';
import { TwilioSmsService } from './twilio-sms.service';
import { mock } from 'jest-mock-extended';
import { MessageListInstance } from 'twilio/lib/rest/api/v2010/account/message';

describe('TwilioSmsService', () => {
  let service: TwilioSmsService;
  let m = mock<MessageListInstance>();

  beforeEach(async () => {
    service = new TwilioSmsService(m);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    const testCases = [
      { input: '+5511994941212', shouldReject: false },
      { input: '+551194941212', shouldReject: false },
      { input: '551194941212', shouldReject: true },
      { input: '12345678900', shouldReject: true },
      { input: '00000000000', shouldReject: true },
      { input: '+5511 (11) 9 94941212', shouldReject: true },
      { input: '+551 (19) 9 94941212', shouldReject: true },
      { input: '####', shouldReject: true },
      { input: '+55', shouldReject: true },
    ];

    const randomString = (Math.random() + 1).toString(36).substring(4);
    m.create.mockResolvedValue({ errorCode: 400 } as any);

    testCases.forEach(({ input, shouldReject }) => {
      it(`${shouldReject ? 'rejects' : 'resolves'} when input is ${input}`, async () => {
        if (shouldReject) {
          await expect(service.send(randomString, input)).rejects.toThrow(responseMessages.invalidPhone);
        } else {
          await expect(service.send(randomString, input)).resolves.not.toThrow(responseMessages.invalidPhone);
        }
      });
    });
  });
});
