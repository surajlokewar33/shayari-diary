const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/suru33_?igsh=NnNhb2o4M2w5a2Zs',
  facebook: 'https://facebook.com/yourpage',
  youtube: 'https://youtube.com/@yourchannel',
};

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-accent">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p className="font-display text-accent-bright text-base">सूरु शाइर</p>
        <p>हर शेर, एक ही जगह सहेजा हुआ।</p>
        <div className="flex items-center gap-5">
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent-bright transition-colors">इंस्टाग्राम</a>
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent-bright transition-colors">फेसबुक</a>
          <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-accent-bright transition-colors">यूट्यूब</a>
        </div>
        <p>&copy; {new Date().getFullYear()} सूरु शाइर </p>
      </div>
    </footer>
  );
}