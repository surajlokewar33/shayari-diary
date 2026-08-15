'use client';

interface InkDriftProps {
  active?: boolean;
  className?: string;
}

export default function InkDrift({
  active = true,
  className = '',
}: InkDriftProps) {
  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
    >
      <style jsx>{`
        @keyframes driftOne {
          0% { transform: translate(0, 0) scale(1); opacity: 0.1; }
          50% { transform: translate(25px, -15px) scale(1.15); opacity: 0.18; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
        }
        @keyframes driftTwo {
          0% { transform: translate(0, 0) scale(1); opacity: 0.12; }
          50% { transform: translate(-30px, 20px) scale(0.9); opacity: 0.06; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.12; }
        }
        @keyframes driftThree {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.08; }
          50% { transform: translate(20px, 15px) rotate(8deg); opacity: 0.16; }
          100% { transform: translate(0, 0) rotate(0deg); opacity: 0.08; }
        }
        .mote-1 {
          animation: driftOne 8s ease-in-out infinite;
        }
        .mote-2 {
          animation: driftTwo 11s ease-in-out infinite 1s;
        }
        .mote-3 {
          animation: driftThree 9s ease-in-out infinite 2s;
        }
        .mote-4 {
          animation: driftOne 13s ease-in-out infinite 3s;
        }
        .mote-5 {
          animation: driftTwo 10s ease-in-out infinite 2.5s;
        }
      `}</style>

      {/* Mote 1: Golden ink dot */}
      <div className="mote-1 absolute top-[15%] left-[10%] w-32 h-32 rounded-full bg-gold/15 blur-2xl" />

      {/* Mote 2: Deep wine/amber ink droplet */}
      <div className="mote-2 absolute bottom-[20%] right-[12%] w-40 h-40 rounded-full bg-rose/15 blur-3xl" />

      {/* Mote 3: Delicate calligraphic flourish arc */}
      <div className="mote-3 absolute top-[30%] right-[25%] w-24 h-24 rounded-full bg-gold/10 blur-xl" />

      {/* Mote 4: Soft amber glow */}
      <div className="mote-4 absolute bottom-[10%] left-[20%] w-36 h-36 rounded-full bg-gold-amber/10 blur-2xl" />

      {/* Mote 5: Center subtle ink aura */}
      <div className="mote-5 absolute top-[50%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-gold/8 blur-3xl" />
    </div>
  );
}
