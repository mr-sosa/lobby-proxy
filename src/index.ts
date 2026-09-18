import express, { Request, Response } from 'express';
require('dotenv').config();
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createMcpServer } from './mcp-server';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}! LobbyPMS MCP & Proxy Server Running.`);
});

// SSE Transport for MCP over HTTP
const transports = new Map<string, SSEServerTransport>();

const handleSse = async (req: Request, res: Response) => {
  console.log('New SSE connection for MCP');
  const transport = new SSEServerTransport('/messages', res);
  transports.set(transport.sessionId, transport);

  transport.onclose = () => {
    console.log(`SSE session closed: ${transport.sessionId}`);
    transports.delete(transport.sessionId);
  };

  const mcpServer = createMcpServer();
  await mcpServer.connect(transport);
};

app.get('/sse', handleSse);
app.get('/mcp', handleSse);

app.post('/messages', async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports.get(sessionId);
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('Active MCP Session not found for sessionId: ' + sessionId);
  }
});

// Existing proxy endpoint
const LOBBY_BASE_URL = process.env.LOBBY_BASE_URL;
const LOBBY_API_KEY = process.env.LOBBY_API_KEY;

app.use('/api/lobby/*', async (req: Request, res: Response) => {
  const lobbyPath = req.params[0];
  const targetUrl = `${LOBBY_BASE_URL}/${lobbyPath}`;

  try {
    const response = await axios({
      method: req.method as any,
      url: targetUrl,
      headers: {
        Authorization: `Bearer ${LOBBY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: req.body,
      params: req.query,
    });
    res.status(response.status).send(response.data);
  } catch (error: any) {
    console.error('Lobby API error:', error.message);
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({ error: error.message });
  }
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, '0.0.0.0', () => {
  console.log(`listening on port ${port}`);
});
