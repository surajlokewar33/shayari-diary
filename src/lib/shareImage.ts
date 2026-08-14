import { Poem } from '@/lib/types';

const COLORS = {
  inkTop: '#0B0F1A',
  inkBottom: '#0E1420',
  gold: '#C9A24B',
  goldBright: '#E4C878',
  parchment: '#F4EFE3',
  muted: '#8B93A7',
};

function getComputedFont(cssVar: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return value ? value : fallback;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];
  for (const para of paragraphs) {
    if (para.trim() === '') {
      lines.push('');
      continue;
    }
    const words = para.split(' ');
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function drawPetal(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#C4536B';
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size / 2.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export async function generateShareImage(poem: Poem): Promise<Blob> {
  if (typeof document !== 'undefined' && (document as any).fonts?.ready) {
    await (document as any).fonts.ready;
  }

  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, COLORS.inkTop);
  grad.addColorStop(1, COLORS.inkBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Soft glow behind title area
  const glow = ctx.createRadialGradient(width / 2, 220, 20, width / 2, 220, 480);
  glow.addColorStop(0, 'rgba(201,162,75,0.16)');
  glow.addColorStop(1, 'rgba(201,162,75,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Decorative petals
  const petalSeeds = [
    [90, 140, 16, 0.4, 0.5], [980, 90, 12, -0.6, 0.4], [60, 1180, 14, 0.9, 0.35],
    [1010, 1230, 18, -0.3, 0.45], [150, 980, 10, 1.1, 0.3], [930, 1000, 13, 0.2, 0.35],
  ];
  petalSeeds.forEach(([x, y, s, r, a]) => drawPetal(ctx, x, y, s, r, a));

  // Outer frame
  ctx.strokeStyle = 'rgba(201,162,75,0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  const isUrdu = poem.language === 'Urdu';
  const isHindi = poem.language === 'Hindi';
  const bodyFont = isUrdu
    ? getComputedFont('--font-urdu', 'serif')
    : isHindi
    ? getComputedFont('--font-devanagari', 'serif')
    : getComputedFont('--font-display', 'Georgia, serif');
  const uiFont = getComputedFont('--font-body', 'Arial, sans-serif');
  const monoFont = getComputedFont('--font-mono', 'monospace');

  const centerX = width / 2;
  const maxTextWidth = width - 200;

  // Category label
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.gold;
  ctx.font = `500 24px ${monoFont}`;
  ctx.fillText(poem.category.toUpperCase(), centerX, 180);

  // Title
  ctx.fillStyle = COLORS.goldBright;
  ctx.font = `600 56px ${bodyFont}`;
  const titleLines = wrapLines(ctx, poem.title, maxTextWidth);
  let cursorY = 270;
  titleLines.slice(0, 2).forEach((line) => {
    ctx.fillText(line, centerX, cursorY);
    cursorY += 68;
  });

  cursorY += 50;

  // Divider
  ctx.strokeStyle = 'rgba(201,162,75,0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX - 60, cursorY);
  ctx.lineTo(centerX + 60, cursorY);
  ctx.stroke();

  cursorY += 70;

  // Body
  ctx.fillStyle = COLORS.parchment;
  ctx.font = `400 40px ${bodyFont}`;
  ctx.textAlign = isUrdu ? 'right' : 'center';
  const bodyX = isUrdu ? centerX + maxTextWidth / 2 : centerX;
  const bodyLines = wrapLines(ctx, poem.body, maxTextWidth).slice(0, 12);
  const lineHeight = isUrdu ? 66 : 58;
  bodyLines.forEach((line) => {
    if (line) ctx.fillText(line, bodyX, cursorY);
    cursorY += lineHeight;
  });

  // Author + site branding at bottom
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.muted;
  ctx.font = `400 28px ${uiFont}`;
  ctx.fillText(`— ${poem.author}`, centerX, height - 150);

  ctx.fillStyle = COLORS.gold;
  ctx.font = `600 32px ${bodyFont}`;
  ctx.fillText('मुरीद शाइर', centerX, height - 90);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate image'));
    }, 'image/png');
  });
}

export async function shareOrDownloadImage(poem: Poem) {
  const blob = await generateShareImage(poem);
  const fileName = `${poem.slug}-shayari.png`;

  if (typeof navigator !== 'undefined' && (navigator as any).canShare) {
    const file = new File([blob], fileName, { type: 'image/png' });
    if ((navigator as any).canShare({ files: [file] })) {
      try {
        await (navigator as any).share({
          files: [file],
          title: poem.title,
          text: `"${poem.title}" — मुरीद शाइर`,
        });
        return;
      } catch {
        // user cancelled or share failed — fall through to download
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}