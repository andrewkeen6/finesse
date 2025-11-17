// Run this script to fetch Google reviews and save them locally
// Usage: GOOGLE_PLACES_API_KEY=xxx GOOGLE_PLACE_ID=xxx node scripts/fetch-reviews.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchReviews() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.error('Missing environment variables!');
    console.error('Usage: GOOGLE_PLACES_API_KEY=xxx GOOGLE_PLACE_ID=xxx node scripts/fetch-reviews.js');
    process.exit(1);
  }

  console.log('Fetching reviews from Google Places API (New)...');

  // Using the new Places API
  const url = `https://places.googleapis.com/v1/places/${placeId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    const allReviews = data.reviews || [];
    const rating = data.rating || 0;
    const totalReviews = data.userRatingCount || 0;

    // Filter to only 5-star reviews
    const fiveStarReviews = allReviews.filter(review => review.rating === 5);

    const output = {
      reviews: fiveStarReviews.slice(0, 5).map(review => ({
        author_name: review.authorAttribution?.displayName || 'Anonymous',
        rating: review.rating || 5,
        text: review.text?.text || review.originalText?.text || '',
        relative_time_description: review.relativePublishTimeDescription || '',
        profile_photo_url: review.authorAttribution?.photoUri || null,
      })),
      rating,
      totalReviews,
      lastFetched: new Date().toISOString(),
    };

    const outputPath = path.join(__dirname, '..', 'src', 'data', 'reviews.json');
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`✓ Successfully fetched ${fiveStarReviews.length} five-star reviews (from ${allReviews.length} total)`);
    console.log(`✓ Overall rating: ${rating} (${totalReviews} total reviews)`);
    console.log(`✓ Saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    process.exit(1);
  }
}

fetchReviews();
