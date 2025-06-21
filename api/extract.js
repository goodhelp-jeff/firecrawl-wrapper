// api/extract.js
import { FirecrawlApp } from '@mendable/firecrawl-js';
import { z } from 'zod';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET requests allowed' });
  }

  const schema = z.object({
    listings: z.array(z.object({
      price: z.string(),
      address: z.string(),
      bed: z.number().optional(),
      bath: z.number().optional(),
      square_footage: z.number().optional(),
    }))
  });

  try {
    const extractResult = await app.extract([
      'https://www.hershenberggroup.com/team/brandon-hooley/*'
    ], {
      prompt: "Navigate to the specified URL, click 'All Listings', then 'See More Listings'. Extract housing data including price, address, bed, bath, and square footage from the displayed listings.",
      schema,
    });

    res.status(200).json({ listings: extractResult.listings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
