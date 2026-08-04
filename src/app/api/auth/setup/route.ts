import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';

// GET: tells the client whether setup is still needed (no admin exists yet)
export async function GET() {
  await dbConnect();
  const count = await Admin.countDocuments();
  return NextResponse.json({ needsSetup: count === 0 });
}

// POST: creates the first admin. Requires ADMIN_SETUP_SECRET and only works once.
export async function POST(req: NextRequest) {
  await dbConnect();
  const count = await Admin.countDocuments();
  if (count > 0) {
    return NextResponse.json({ error: 'Setup already completed' }, { status: 403 });
  }

  const { username, password, setupSecret } = await req.json();
  if (setupSecret !== process.env.ADMIN_SETUP_SECRET) {
    return NextResponse.json({ error: 'Invalid setup secret' }, { status: 403 });
  }
  if (!username || !password || password.length < 8) {
    return NextResponse.json(
      { error: 'Username and a password of 8+ characters are required' },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ username, passwordHash });

  return NextResponse.json({ ok: true });
}
