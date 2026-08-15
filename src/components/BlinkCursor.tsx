'use client';

interface BlinkCursorProps {
  symbol?: '।';
  className?: string;
}

export default function BlinkCursor({
  symbol = '।',
  className = '',
}: BlinkCursorProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block text-amber select-none animate-pulse font-bold ml-0.5 ${className}`}
      style={{ animationDuration: '1.2s' }}
    >
      {symbol}
    </span>
  );
}
