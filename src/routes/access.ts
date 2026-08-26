import { Router } from 'express';
import cors from 'cors';

import { clientId as defaultClientId } from '../helpers/constants.js';

interface AccessRequestBody {
  clientId?: string;
  client_secret?: string;
  refresh_token?: string;
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
}

const accessRouter = Router();

accessRouter.use(cors({ methods: ['POST'] }));

accessRouter.post('/', async (req, res) => {
  const body = req.body as AccessRequestBody;
  const clientSecret = body.client_secret || process.env.CLIENT_SECRET;

  if (!body.refresh_token) {
    res.status(400).json({ error: 'refresh_token is required' });
    return;
  }

  if (!clientSecret) {
    res.status(500).json({ error: 'CLIENT_SECRET is not configured' });
    return;
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: body.clientId || defaultClientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: body.refresh_token,
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.json().catch(() => ({
      error: 'token_exchange_failed',
    }));
    res.status(tokenResponse.status).json(error);
    return;
  }

  const { expires_in, access_token } =
    (await tokenResponse.json()) as GoogleTokenResponse;

  res.json({ expires_in, access_token });
});

export default accessRouter;
