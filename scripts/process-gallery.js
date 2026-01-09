import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import heicConvert from 'heic-convert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const PATHS = {
  source: path.join(projectRoot, 'public', 'gallery'),
  fullRes: path.join(projectRoot, 'public', 'gallery', 'full'),
  images: path.join(projectRoot, 'src', 'assets', 'gallery', 'images'),
  videoThumbs: path.join(projectRoot, 'src', 'assets', 'gallery', 'video-thumbs'),
  manifest: path.join(projectRoot, 'src', 'data', 'gallery-manifest.json'),
};

const EXTENSIONS = {
  images: ['.jpg', '.jpeg', '.png', '.heic', '.HEIC', '.webp', '.gif'],
  videos: ['.mov', '.mp4', '.MOV', '.MP4'],
};

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
}

async function convertHeicToJpeg(heicPath, outputPath) {
  console.log(`Converting HEIC: ${path.basename(heicPath)}`);
  try {
    const inputBuffer = await fs.readFile(heicPath);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.92,
    });
    await fs.writeFile(outputPath, Buffer.from(outputBuffer));
    return true;
  } catch (error) {
    console.error(`Failed to convert ${heicPath}:`, error.message);
    return false;
  }
}

async function optimizeImage(inputPath, outputPath) {
  console.log(`Optimizing image: ${path.basename(inputPath)}`);
  try {
    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true })
      .withMetadata()
      .jpeg({ quality: 85 })
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`Failed to optimize ${inputPath}:`, error.message);
    return false;
  }
}

async function generateVideoThumbnail(videoPath, outputPath) {
  console.log(`Generating video thumbnail: ${path.basename(videoPath)}`);
  return new Promise((resolve) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['00:00:01'],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '800x?',
      })
      .on('end', () => resolve(true))
      .on('error', (error) => {
        console.error(`Failed to generate thumbnail for ${videoPath}:`, error.message);
        resolve(false);
      });
  });
}

async function copyFile(source, destination) {
  try {
    await fs.copyFile(source, destination);
    return true;
  } catch (error) {
    console.error(`Failed to copy ${source}:`, error.message);
    return false;
  }
}

async function getFilesRecursive(dir, extensions) {
  const files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip the 'full' directory to avoid recursion
        if (entry.name !== 'full') {
          const subFiles = await getFilesRecursive(fullPath, extensions);
          files.push(...subFiles);
        }
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext) || extensions.includes(ext.toUpperCase())) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return files;
}

function extractDateFromFilename(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function extractCategoryFromFilename(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('cadillac') || lower.includes('mercedes') || lower.includes('porsche') ||
      lower.includes('range') || lower.includes('van')) {
    return 'vehicle';
  }
  return 'gallery';
}

async function processGallery() {
  console.log('🎨 Starting gallery processing...\n');

  // Create directories
  console.log('📁 Creating directories...');
  await ensureDir(PATHS.fullRes);
  await ensureDir(PATHS.images);
  await ensureDir(PATHS.videoThumbs);
  await ensureDir(path.dirname(PATHS.manifest));

  // Get all media files
  console.log('\n📸 Scanning for media files...');
  const imageFiles = await getFilesRecursive(PATHS.source, EXTENSIONS.images);
  const videoFiles = await getFilesRecursive(PATHS.source, EXTENSIONS.videos);

  console.log(`Found ${imageFiles.length} images and ${videoFiles.length} videos\n`);

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalImages: 0,
    totalVideos: 0,
    media: [],
  };

  // Process images
  console.log('🖼️  Processing images...');
  for (const imagePath of imageFiles) {
    const filename = path.basename(imagePath);
    const ext = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, ext);
    const id = baseName;

    // Determine output paths
    const isHeic = ext === '.heic' || ext === '.HEIC';
    const outputExt = isHeic ? '.jpg' : ext;
    const outputFilename = `${baseName}${outputExt}`;

    const fullResPath = path.join(PATHS.fullRes, filename);
    const optimizedPath = path.join(PATHS.images, outputFilename);

    let success = true;

    // Copy to full-res directory
    await copyFile(imagePath, fullResPath);

    // Convert HEIC or optimize image
    if (isHeic) {
      const tempJpeg = path.join(PATHS.images, `${baseName}.jpg`);
      const converted = await convertHeicToJpeg(imagePath, tempJpeg);
      if (converted) {
        await optimizeImage(tempJpeg, optimizedPath);
      } else {
        success = false;
      }
    } else {
      await optimizeImage(imagePath, optimizedPath);
    }

    if (success) {
      manifest.media.push({
        id,
        type: 'image',
        thumbnail: `/src/assets/gallery/images/${outputFilename}`,
        full: `/gallery/full/${filename}`,
        category: extractCategoryFromFilename(filename),
        date: extractDateFromFilename(filename) || 'unknown',
        originalFormat: ext.replace('.', ''),
      });
      manifest.totalImages++;
    }
  }

  // Process videos
  console.log('\n🎥 Processing videos...');
  for (const videoPath of videoFiles) {
    const filename = path.basename(videoPath);
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);
    const id = baseName;

    const fullResPath = path.join(PATHS.fullRes, filename);
    const thumbnailPath = path.join(PATHS.videoThumbs, `${baseName}.jpg`);

    // Copy to full-res directory
    await copyFile(videoPath, fullResPath);

    // Generate thumbnail
    const success = await generateVideoThumbnail(videoPath, thumbnailPath);

    if (success) {
      manifest.media.push({
        id,
        type: 'video',
        thumbnail: `/src/assets/gallery/video-thumbs/${baseName}.jpg`,
        full: `/gallery/full/${filename}`,
        category: extractCategoryFromFilename(filename),
        date: extractDateFromFilename(filename) || 'unknown',
      });
      manifest.totalVideos++;
    }
  }

  // Sort media by date (newest first, reverse chronological)
  manifest.media.sort((a, b) => {
    if (a.date === 'unknown') return 1;
    if (b.date === 'unknown') return -1;
    return b.date.localeCompare(a.date);
  });

  // Write manifest
  console.log('\n📝 Writing manifest...');
  await fs.writeFile(PATHS.manifest, JSON.stringify(manifest, null, 2));

  console.log('\n✅ Gallery processing complete!');
  console.log(`   Images processed: ${manifest.totalImages}`);
  console.log(`   Videos processed: ${manifest.totalVideos}`);
  console.log(`   Total media items: ${manifest.media.length}`);
  console.log(`\n📄 Manifest written to: ${PATHS.manifest}`);
}

// Run the script
processGallery().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
