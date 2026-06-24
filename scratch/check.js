import { db } from '../configs/db.js';
import { CarListing } from '../configs/schema.js';

async function check() {
  try {
    const result = await db.select().from(CarListing);
    console.log("Database listings count:", result.length);
    console.log("Listings details:", result.map(r => ({ id: r.id, title: r.listingTitle, category: r.category })));
    process.exit(0);
  } catch (error) {
    console.error("Query failed:", error);
    process.exit(1);
  }
}
check();
