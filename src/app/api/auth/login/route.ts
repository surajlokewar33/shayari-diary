import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';
import { signSession, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { username, password } = await req.json();

  const admin = await Admin.findOne({ username });
  if (!admin) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const token = await signSession({ adminId: admin._id.toString(), username: admin.username });

  const res = NextResponse.json({ ok: true, username: admin.username });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
