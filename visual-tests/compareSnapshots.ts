import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export async function compareScreenshotToBaseline({
  screenshotBuffer,
  name,
  threshold = 0.01,
}: {
  screenshotBuffer: Buffer;
  name: string;
  threshold?: number;
}) {
  const baselineDir = path.join(process.cwd(), 'visual-tests', 'snapshots', 'baseline');
  const actualDir = path.join(process.cwd(), 'visual-tests', 'snapshots', 'actual');
  const diffDir = path.join(process.cwd(), 'visual-tests', 'snapshots', 'diff');

  fs.mkdirSync(baselineDir, { recursive: true });
  fs.mkdirSync(actualDir, { recursive: true });
  fs.mkdirSync(diffDir, { recursive: true });

  const baselinePath = path.join(baselineDir, `${name}.png`);
  const actualPath = path.join(actualDir, `${name}.png`);
  const diffPath = path.join(diffDir, `${name}.png`);

  fs.writeFileSync(actualPath, screenshotBuffer);

  if (!fs.existsSync(baselinePath)) {
    fs.copyFileSync(actualPath, baselinePath);
    return {
      passed: true,
      message: `Baseline created at ${baselinePath}`,
      baselinePath,
      actualPath,
      diffPath,
    };
  }

  const baselineImage = PNG.sync.read(fs.readFileSync(baselinePath));
  const actualImage = PNG.sync.read(screenshotBuffer);
  const { width, height } = baselineImage;
  const diffImage = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    baselineImage.data,
    actualImage.data,
    diffImage.data,
    width,
    height,
    { threshold: 0.1 }
  );

  const diffRatio = numDiffPixels / (width * height);
  fs.writeFileSync(diffPath, PNG.sync.write(diffImage));

  return {
    passed: diffRatio <= threshold,
    message: `Diff ratio: ${(diffRatio * 100).toFixed(2)}%`,
    baselinePath,
    actualPath,
    diffPath,
  };
}
