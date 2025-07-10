import express from 'express';
require('dotenv').config();
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(bodyParser.json());
app.use(cors()); // Or configure CORS more specifically

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

const LOBBY_BASE_URL = process.env.LOBBY_BASE_URL;
const LOBBY_API_KEY = process.env.LOBBY_API_KEY;

app.use('/api/lobby/*', async (req, res) => {
  const lobbyPath = req.params[0];
  const targetUrl = `${LOBBY_BASE_URL}/${lobbyPath}`;

  try {
    const response = await axios({
      method: req.method as any,
      url: targetUrl,
      headers: {
        Authorization: `Bearer ${LOBBY_API_KEY}`,
        'Content-Type': 'application/json', // Or other required headers
      },
      data: req.body,
      params: req.query,
    });
    res.status(response.status).send(response.data);
  } catch (error: any) {
    console.error('Lobby API error:', error.message);
    console.error('Response data:', error)
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({ error: error.message });
  }
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

