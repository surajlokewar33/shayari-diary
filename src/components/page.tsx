const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/yourhandle',
  facebook: 'https://facebook.com/yourpage',
  youtube: 'https://youtube.com/@yourchannel',
  email: 'youremail@example.com',
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 md:px-8 py-20">
      <h1 className="font-display text-4xl text-accent-bright mb-4">Contact Us</h1>
      <p className="text-muted mb-10">
        Have a shayari to share, feedback, or just want to say hello? Reach out below.
      </p>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div>
          <p className="text-xs font-mono text-muted mb-1">Email</p>
          <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-accent-bright hover:underline">
            {SOCIAL_LINKS.email}
          </a>
        </div>
        <div className="ink-divider" />
        <div>
          <p className="text-xs font-mono text-muted mb-1">Instagram</p>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-accent-bright hover:underline">
            {SOCIAL_LINKS.instagram.replace('https://', '')}
          </a>
        </div>
        <div className="ink-divider" />
        <div>
          <p className="text-xs font-mono text-muted mb-1">Facebook</p>
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-accent-bright hover:underline">
            {SOCIAL_LINKS.facebook.replace('https://', '')}
          </a>
        </div>
        <div className="ink-divider" />
        <div>
          <p className="text-xs font-mono text-muted mb-1">YouTube</p>
          <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-accent-bright hover:underline">
            {SOCIAL_LINKS.youtube.replace('https://', '')}
          </a>
        </div>
      </div>
    </main>
  );
}