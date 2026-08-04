'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/setup')
      .then((r) => r.json())
      .then((d) => setNeedsSetup(d.needsSetup));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (needsSetup) {
        const res = await fetch('/api/auth/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, setupSecret }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Setup failed');
        setNeedsSetup(false);
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (needsSetup === null) {
    return <div className="mx-auto max-w-md px-5 py-24 text-center text-muted">Loading…</div>;
  }

  return (
    <section className="mx-auto max-w-md px-5 py-24">
      <h1 className="font-display text-3xl text-accent-bright mb-2 text-center">
        {needsSetup ? 'Create your admin account' : 'Admin Login'}
      </h1>
      <p className="text-muted text-sm text-center mb-10">
        {needsSetup ? 'This runs once, the first time you deploy Inkwell.' : 'Sign in to manage your diary.'}
      </p>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-xs text-muted font-mono block mb-1">Username</label>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border border-accent rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-bright"
          />
        </div>
        <div>
          <label className="text-xs text-muted font-mono block mb-1">Password</label>
          <input
            required
            type="password"
            minLength={needsSetup ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-accent rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-bright"
          />
        </div>
        {needsSetup && (
          <div>
            <label className="text-xs text-muted font-mono block mb-1">Setup secret (ADMIN_SETUP_SECRET)</label>
            <input
              required
              type="password"
              value={setupSecret}
              onChange={(e) => setSetupSecret(e.target.value)}
              className="w-full bg-transparent border border-accent rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-bright"
            />
          </div>
        )}
        {error && <p className="text-rose text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full text-sm px-4 py-2.5 rounded-full bg-accent/20 border border-accent text-accent-bright hover:bg-accent/30 transition-colors disabled:opacity-50"
        >
          {loading ? 'Please wait…' : needsSetup ? 'Create account' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
