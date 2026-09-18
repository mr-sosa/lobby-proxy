import { makeLobbyApiRequest } from '../src/api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as unknown as jest.Mock;

describe('api wrappers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.LOBBY_API_KEY = 'test_api_key';
    process.env.LOBBY_BASE_URL = 'http://test.api';
  });

  it('should make successful request to target api', async () => {
    mockedAxios.mockResolvedValueOnce({ status: 200, data: { success: true } });

    const result = await makeLobbyApiRequest('GET', '/rooms', undefined, { page: 1 });

    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'http://test.api/rooms',
        headers: expect.objectContaining({
          Authorization: 'Bearer test_api_key',
        }),
        params: { page: 1 },
      })
    );
    expect(result).toEqual({ success: true });
  });

  it('should handle API errors appropriately', async () => {
    mockedAxios.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { message: 'Invalid data' },
      },
    });

    await expect(makeLobbyApiRequest('POST', '/block', { test: 1 })).rejects.toThrow(
      'Lobby API error [400]: {"message":"Invalid data"}'
    );
  });
});
