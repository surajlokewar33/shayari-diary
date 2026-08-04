const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/suru33_?igsh=NnNhb2o4M2w5a2Zs',
  youtube: 'https://youtube.com/@suru...0123?si=6p5AgL-P44LxbjkB',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-20">
      <div className="glass rounded-3xl p-8 md:p-12 text-center">
        <img
          src="/profile.jpeg"
          alt="Suru"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto border-2 border-accent"
        />

        <h1 className="font-display text-3xl md:text-4xl text-accent-bright mt-6">सुरज लोकेवार </h1>
        <p className="text-muted mt-2 font-mono text-sm">शायर · लेखक</p>

        <p className="poem-body text-parchment/90 mt-6 max-w-xl mx-auto">
          हर शब्द एक एहसास है, हर शेर एक कहानी। जुड़िए, बातें कीजिए, अपनी राय दीजिए।
        </p>

        <div className="ink-divider my-8" />

        <div className="flex items-center justify-center gap-6">
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center gap-2 text-sm text-muted hover:text-accent-bright transition-colors font-mono px-4 py-2 rounded-full border border-accent glow-hover">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>इंस्टाग्राम</span>
          </a>
          <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex items-center gap-2 text-sm text-muted hover:text-accent-bright transition-colors font-mono px-4 py-2 rounded-full border border-accent glow-hover">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
            </svg>
            <span>यूट्यूब</span>
          </a>
        </div>
      </div>
    </div>
  );
}