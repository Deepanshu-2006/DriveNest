"use server"

import { db } from "@/configs/db";
import { CarListing, Users, CarFeatures, CarImages } from "@/configs/schema";
import { eq } from "drizzle-orm";
import featuresData from "@/app/Shared/features.json";

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

export async function getUserCarListings(email) {
  try {
    const userRecord = await db.select().from(Users).where(eq(Users.email, email));
    
    if (userRecord.length === 0) {
      return [];
    }
    
    const userId = userRecord[0].id;
    
    const listings = await db.select().from(CarListing).where(eq(CarListing.userId, userId));
    
    const listingsWithImages = await Promise.all(
      listings.map(async (listing) => {
        const images = await db.select().from(CarImages).where(eq(CarImages.carListingId, listing.id));
        return {
          ...listing,
          images
        };
      })
    );
    
    return JSON.parse(JSON.stringify(listingsWithImages));
  } catch (error) {
    console.error("Failed to fetch user listings server action error:", error);
    return [];
  }
}

export async function deleteCarListing(id) {
  try {
    await db.delete(CarListing).where(eq(CarListing.id, id));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete car listing server action error:", error);
    return { success: false, error: error.message };
  }
}

export async function getCarListingById(id) {
  try {
    const listing = await db.select().from(CarListing).where(eq(CarListing.id, id));
    if (listing.length === 0) {
      return null;
    }
    const images = await db.select().from(CarImages).where(eq(CarImages.carListingId, id));
    const features = await db.select().from(CarFeatures).where(eq(CarFeatures.carListingId, id));
    
    // Normalize features to camelCase names if they are stored as labels
    const normalizedFeatures = {};
    features.forEach(feat => {
      const match = featuresData.features.find(
        f => f.label === feat.featureName || f.name === feat.featureName
      );
      if (match) {
        normalizedFeatures[match.name] = true;
      } else {
        normalizedFeatures[feat.featureName] = true;
      }
    });

    return JSON.parse(JSON.stringify({
      ...listing[0],
      images: images.map(img => img.imageUrl),
      features: normalizedFeatures
    }));
  } catch (error) {
    console.error("Failed to get car listing by ID server action error:", error);
    return null;
  }
}

export async function updateCarListing(id, data) {
  try {
    // 1. Update main car listing
    await db.update(CarListing)
      .set({
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
      })
      .where(eq(CarListing.id, id));

    // 2. Delete existing images and re-insert new ones
    await db.delete(CarImages).where(eq(CarImages.carListingId, id));
    if (data.images && data.images.length > 0) {
      const imageInsertions = data.images.map(url => ({
        imageUrl: url,
        carListingId: id
      }));
      await db.insert(CarImages).values(imageInsertions);
    }

    // 3. Delete existing features and re-insert checked ones
    await db.delete(CarFeatures).where(eq(CarFeatures.carListingId, id));
    const featureInsertions = [];
    if (data.features) {
      Object.entries(data.features).forEach(([featureName, isChecked]) => {
        if (isChecked) {
          featureInsertions.push({
            carListingId: id,
            featureName
          });
        }
      });
    }
    if (featureInsertions.length > 0) {
      await db.insert(CarFeatures).values(featureInsertions);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to update car listing server action error:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllCarListings() {
  try {
    const listings = await db.select().from(CarListing);
    const listingsWithImages = await Promise.all(
      listings.map(async (listing) => {
        const images = await db.select().from(CarImages).where(eq(CarImages.carListingId, listing.id));
        return {
          ...listing,
          images
        };
      })
    );
    return JSON.parse(JSON.stringify(listingsWithImages));
  } catch (error) {
    console.error("Failed to fetch all listings server action error:", error);
    return [];
  }
}



