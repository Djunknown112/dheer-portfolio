// Browser-based auto image enhancement. No AI, no network calls.
// - Auto white-balance (per-channel contrast stretch, robust percentiles)
// - Mild saturation boost (+12%)
// - Unsharp mask sharpening
// - Resize cap at 2400px longest side
// - Output as WebP (quality 0.9)
// Skips GIF / SVG / video / non-image files.

const MAX_DIM = 2400;
const SAT_BOOST = 0.12;
const SHARP_AMOUNT = 0.6;
const WEBP_QUALITY = 0.9;

const SKIP = /^(image\/gif|image\/svg|image\/svg\+xml|video\/)/i;

export async function enhanceImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || SKIP.test(file.type)) return file;
  try {
    const bmp = await loadBitmap(file);
    const { canvas, ctx } = drawScaled(bmp, MAX_DIM);
    bmp.close?.();

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    autoWhiteBalance(img);
    saturate(img, SAT_BOOST);
    ctx.putImageData(img, 0, 0);

    unsharpMask(canvas, ctx, SHARP_AMOUNT);

    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob(res, "image/webp", WEBP_QUALITY)
    );
    if (!blob) return file;
    if (blob.size >= file.size && file.type === "image/webp") return file;

    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  } catch (err) {
    console.warn("[enhanceImage] skipped:", err);
    return file;
  }
}

export async function enhanceImages(files: FileList | File[]): Promise<File[]> {
  const arr = Array.from(files);
  return Promise.all(arr.map(enhanceImage));
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  if ("createImageBitmap" in window) {
    return await createImageBitmap(file);
  }
  // fallback
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext("2d")!.drawImage(img, 0, 0);
    return (await createImageBitmap(c));
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawScaled(bmp: ImageBitmap, max: number) {
  let { width, height } = bmp;
  const longest = Math.max(width, height);
  if (longest > max) {
    const r = max / longest;
    width = Math.round(width * r);
    height = Math.round(height * r);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bmp, 0, 0, width, height);
  return { canvas, ctx };
}

// Per-channel contrast stretch using 1st/99th percentile -> white balance + punch.
function autoWhiteBalance(img: ImageData) {
  const d = img.data;
  const hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
  for (let i = 0; i < d.length; i += 4) {
    hist[0][d[i]]++;
    hist[1][d[i + 1]]++;
    hist[2][d[i + 2]]++;
  }
  const total = d.length / 4;
  const lo = total * 0.01;
  const hi = total * 0.99;
  const lut: Uint8ClampedArray[] = [];
  for (let c = 0; c < 3; c++) {
    let acc = 0;
    let min = 0;
    let max = 255;
    for (let v = 0; v < 256; v++) {
      acc += hist[c][v];
      if (acc >= lo) { min = v; break; }
    }
    acc = 0;
    for (let v = 0; v < 256; v++) {
      acc += hist[c][v];
      if (acc >= hi) { max = v; break; }
    }
    if (max <= min) { max = min + 1; }
    const t = new Uint8ClampedArray(256);
    const scale = 255 / (max - min);
    for (let v = 0; v < 256; v++) {
      t[v] = Math.max(0, Math.min(255, (v - min) * scale));
    }
    lut.push(t);
  }
  for (let i = 0; i < d.length; i += 4) {
    d[i] = lut[0][d[i]];
    d[i + 1] = lut[1][d[i + 1]];
    d[i + 2] = lut[2][d[i + 2]];
  }
}

function saturate(img: ImageData, amount: number) {
  const d = img.data;
  const f = 1 + amount;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
    d[i] = Math.max(0, Math.min(255, gray + (r - gray) * f));
    d[i + 1] = Math.max(0, Math.min(255, gray + (g - gray) * f));
    d[i + 2] = Math.max(0, Math.min(255, gray + (b - gray) * f));
  }
}

// Unsharp mask: sharpened = original + amount * (original - blurred)
function unsharpMask(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, amount: number) {
  const w = canvas.width, h = canvas.height;
  const original = ctx.getImageData(0, 0, w, h);

  // Blur via canvas filter (fast, GPU when available)
  const blurCanvas = document.createElement("canvas");
  blurCanvas.width = w; blurCanvas.height = h;
  const bctx = blurCanvas.getContext("2d")!;
  (bctx as any).filter = "blur(1.2px)";
  bctx.drawImage(canvas, 0, 0);
  const blurred = bctx.getImageData(0, 0, w, h);

  const o = original.data, bl = blurred.data;
  for (let i = 0; i < o.length; i += 4) {
    o[i] = clamp(o[i] + amount * (o[i] - bl[i]));
    o[i + 1] = clamp(o[i + 1] + amount * (o[i + 1] - bl[i + 1]));
    o[i + 2] = clamp(o[i + 2] + amount * (o[i + 2] - bl[i + 2]));
  }
  ctx.putImageData(original, 0, 0);
}

function clamp(v: number) {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}
