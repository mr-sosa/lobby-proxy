import axios, { Method } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Perform a request to the Lobby API
 * @param method HTTP method
 * @param path Endpoint path (e.g. '/rooms')
 * @param data Request body data (optional)
 * @param params Query parameters (optional)
 * @returns Response data
 */
export async function makeLobbyApiRequest(
  method: Method,
  path: string,
  data?: any,
  params?: any
): Promise<any> {
  const LOBBY_BASE_URL = process.env.LOBBY_BASE_URL || 'https://api.casabarcelona.com.co/api/lobby';
  const LOBBY_API_KEY = process.env.LOBBY_API_KEY;

  if (!LOBBY_API_KEY) {
    console.warn('LOBBY_API_KEY is not defined in environment variables.');
  }

  const targetUrl = `${LOBBY_BASE_URL}${path}`;

  try {
    const response = await axios({
      method,
      url: targetUrl,
      headers: {
        Authorization: `Bearer ${LOBBY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data,
      params,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const statusCode = error.response.status;
      const responseData = error.response.data;
      throw new Error(`Lobby API error [${statusCode}]: ${JSON.stringify(responseData)}`);
    } else {
      throw new Error(`Lobby API request failed: ${error.message}`);
    }
  }
}
