import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

function getSecret() {
  const jwt = process.env.JWT_SECRET;
  if (!jwt) {
    throw new Error('JWT_SECRET environment variable is not set. Admin auth will not work.');
  }
  return new TextEncoder().encode(jwt);
}

const secret = getSecret();
export const SESSION_COOKIE = 'shayari_admin_session';

export type SessionPayload = { adminId: string; username: string };

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { adminId: payload.adminId as string, username: payload.username as string };
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}
