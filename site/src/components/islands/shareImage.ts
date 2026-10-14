export interface ShareCard {
  brand: string;
  kicker: string;
  headline: string;
  big: string;
  sub: string;
  footer: string;
}

const FONT = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",system-ui,sans-serif';

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, weight: number, startSize: number) {
  let size = startSize;
  do {
    ctx.font = `${weight} ${size}px ${FONT}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  } while (size > 20);
  return size;
}

/** 1080×1440 (3:4) card — the native Xiaohongshu / Instagram portrait size. */
export async function renderShareCard(card: ShareCard): Promise<Blob | null> {
  const W = 1080;
  const H = 1440;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#064e3b');
  bg.addColorStop(1, '#059669');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // soft decorative circles
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath();
  ctx.arc(W - 120, 180, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(120, H - 160, 220, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 44px ${FONT}`;
  ctx.fillText(card.brand, 90, 140);

  ctx.fillStyle = '#a7f3d0';
  ctx.font = `600 46px ${FONT}`;
  ctx.fillText(card.kicker, 90, 420);

  ctx.fillStyle = '#ffffff';
  fitText(ctx, card.headline, W - 180, 800, 76);
  ctx.fillText(card.headline, 90, 520);

  ctx.fillStyle = '#fde047';
  fitText(ctx, card.big, W - 180, 900, 200);
  ctx.fillText(card.big, 84, 760);

  ctx.fillStyle = '#ecfdf5';
  fitText(ctx, card.sub, W - 180, 500, 44);
  ctx.fillText(card.sub, 90, 860);

  // footer pill
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  const pillY = H - 230;
  ctx.beginPath();
  ctx.roundRect(90, pillY, W - 180, 120, 60);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  fitText(ctx, card.footer, W - 260, 600, 44);
  ctx.fillText(card.footer, W / 2, pillY + 76);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
}

/** Uses the native share sheet when it can share files; otherwise downloads. */
export async function shareOrDownload(blob: Blob, filename: string, title: string): Promise<'shared' | 'downloaded'> {
  const file = new File([blob], filename, { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title });
      return 'shared';
    } catch {
      /* cancelled — fall through to download */
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2_000);
  return 'downloaded';
}
