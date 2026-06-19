"use server"

import { db } from "@/configs/db";
import { CarListing, Users, CarFeatures, CarImages } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function createCarListing(data) {
  try {
    // 1. Sync/Upsert user information in the Users table
    let userId;
    const userRecord = await db.select().from(Users).where(eq(Users.email, data.userEmail));
    
    if (userRecord.length === 0) {
      const newUser = await db.insert(Users).values({
        email: data.userEmail,
        name: data.userName || 'Anonymous',
        postedOn: new Date().toLocaleDateString()
      }).returning({ id: Users.id });
      userId = newUser[0].id;
    } else {
      userId = userRecord[0].id;
    }

    // 2. Insert main car listing (referencing the userId, removing direct user details/date)
    const result = await db.insert(CarListing).values({
      listingTitle: data.listingTitle,
      tagline: data.tagline || null,
      originalPrice: data.originalPrice || null,
      sellingPrice: data.sellingPrice,
      category: data.category,
      condition: data.condition,
      make: data.make,
      model: data.model,
      year: data.year,
      driveType: data.driveType || null,
      transmission: data.transmission,
      fuelType: data.fuelType,
      mileage: data.mileage,
      engine: data.engine || null,
      cylinder: data.cylinder || null,
      color: data.color,
      door: data.door || null,
      vin: data.vin || null,
      description: data.description,
      userId: userId
    }).returning({ id: CarListing.id });

    const carListingId = result[0].id;

    // 3. Insert images relationally in the CarImages table
    if (data.images && data.images.length > 0) {
      const imageInsertions = data.images.map(url => ({
        imageUrl: url,
        carListingId: carListingId
      }));
      await db.insert(CarImages).values(imageInsertions);
    }

    // 4. Map features relationally in the CarFeatures table (only insert checked ones)
    const featureInsertions = [];
    if (data.features) {
      Object.entries(data.features).forEach(([featureName, isChecked]) => {
        if (isChecked) {
          featureInsertions.push({
            carListingId,
            featureName
          });
        }
      });
    }

    if (featureInsertions.length > 0) {
      await db.insert(CarFeatures).values(featureInsertions);
    }

    return { success: true, id: carListingId };
  } catch (error) {
    console.error("Failed to create car listing server action error:", error);
    return { success: false, error: error.message };
  }
}
