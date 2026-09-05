import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'https://hacksaw-traps-mantra.ngrok-free.dev';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === 'OPTIONS') {
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://room-root.vercel.app'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'POST, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept'
    );

    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/auth/send-code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(req.body)
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        success: response.ok,
        message: text
      };
    }

    return res.status(response.status).json(data);

  } catch (error) {
    console.error('RoomRoot backend proxy error:', error);

    return res.status(502).json({
      success: false,
      message: 'RoomRoot backend is unavailable'
    });
  }
}
