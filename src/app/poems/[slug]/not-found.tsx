import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-32 text-center">
      <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-4">404</p>
      <h1 className="font-display text-3xl text-accent-bright mb-4">This page hasn't been written yet.</h1>
      <p className="text-muted mb-8">The poem you're looking for doesn't exist, or has been removed.</p>
      <Link href="/" className="text-sm px-5 py-2.5 rounded-full bg-accent/20 border border-accent text-accent-bright hover:bg-accent/30 transition-colors">
        Back to the diary
      </Link>
    </section>
  );
}
