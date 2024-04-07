import { GenerateCodeService } from './generate-code.service';
import { CacheService } from '../../interfaces/cache-service.interface';
import { mock, MockProxy } from 'jest-mock-extended';

describe('GenerateCodeService', () => {
  let service: GenerateCodeService;
  let cache: MockProxy<CacheService>;

  beforeEach(async () => {
    cache = mock();
    service = new GenerateCodeService(cache);
  });

  describe('randomCode', () => {
    it('should return a string with length 6', async () => {
      const length = 6;
      const code = service.randomCode(length);

      expect(code.length).toEqual(length);
    });
  });

  describe('uniqueCode', () => {
    it('should call randomCode, cache.get', async () => {
      const codeSpy = jest.spyOn(service, 'randomCode');
      const CODE_LENGTH = 6;
      await service.uniqueCode(CODE_LENGTH);

      expect(codeSpy).toHaveBeenCalled();
      expect(codeSpy).toHaveReturned();
      expect(cache.get).toHaveBeenCalled();
      expect(cache.get).toHaveLastReturnedWith(undefined);
    });

    it('should return a code with the specified length correctly', async () => {
      const CODE_LENGTH = 6;
      jest.spyOn(service, 'randomCode').mockReturnValue('1'.repeat(CODE_LENGTH));
      cache.get.mockResolvedValue(undefined);
      const result = await service.uniqueCode(CODE_LENGTH);

      expect(typeof result).toBe('string');
      expect(result.length).toBe(CODE_LENGTH);
    });
  });
});
