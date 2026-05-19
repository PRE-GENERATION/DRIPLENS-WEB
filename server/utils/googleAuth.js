import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';

const getClient = () => {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not configured in environment variables');
  }
  return new OAuth2Client(env.GOOGLE_CLIENT_ID);
};

export async function verifyGoogleToken(idToken) {
  try {
    const client = getClient();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (err) {
    console.error('Google Token Verification Failed:', err.message);
    throw new Error('Invalid Google token: ' + err.message, { cause: err });
  }
}
