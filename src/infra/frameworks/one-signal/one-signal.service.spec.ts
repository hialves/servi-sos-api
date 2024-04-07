import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { OnesignalService } from './one-signal.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OnesignalService', () => {
  let service: OnesignalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnesignalService],
    }).compile();

    service = module.get<OnesignalService>(OnesignalService);
    mockedAxios.create = jest.fn(() => mockedAxios);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotificationToUser', () => {
    it('should send a notification successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      await expect(
        service.sendNotificationToUser('TestUser', { en: 'Test Content' }, { en: 'Test Heading' }),
      ).resolves.not.toThrow();

      expect(mockedAxios.post).toHaveBeenCalledWith('/notifications', {
        app_id: process.env.ONESIGNAL_APP_KEY,
        contents: { en: 'Test Content' },
        headings: { en: 'Test Heading' },
        include_external_user_ids: ['TestUser'],
      });
    });

    it('should throw an HttpException if the request fails', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error());

      await expect(
        service.sendNotificationToUser('TestUser', { en: 'Test Content' }, { en: 'Test Heading' }),
      ).rejects.toThrow(HttpException);
    });
  });
});
