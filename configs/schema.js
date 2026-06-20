import { pgTable, serial, varchar, text, integer } from 'drizzle-orm/pg-core';

export const Users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  postedOn: varchar('postedOn', { length: 255 })
});

export const CarListing = pgTable('carListing', {
  id: serial('id').primaryKey(),
  listingTitle: varchar('listingTitle', { length: 255 }).notNull(),
  tagline: varchar('tagline', { length: 255 }),
  originalPrice: varchar('originalPrice', { length: 255 }),
  sellingPrice: varchar('sellingPrice', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  condition: varchar('condition', { length: 255 }).notNull(),
  make: varchar('make', { length: 255 }).notNull(),
  model: varchar('model', { length: 255 }).notNull(),
  year: varchar('year', { length: 255 }).notNull(),
  driveType: varchar('driveType', { length: 255 }),
  transmission: varchar('transmission', { length: 255 }).notNull(),
  fuelType: varchar('fuelType', { length: 255 }).notNull(),
  mileage: varchar('mileage', { length: 255 }).notNull(),
  engine: varchar('engine', { length: 255 }),
  cylinder: varchar('cylinder', { length: 255 }),
  color: varchar('color', { length: 255 }).notNull(),
  door: varchar('door', { length: 255 }),
  vin: varchar('vin', { length: 255 }),
  description: text('description').notNull(),
  userId: integer('userId').references(() => Users.id).notNull()
});

export const CarImages = pgTable('carImages', {
  id: serial('id').primaryKey(),
  imageUrl: text('imageUrl').notNull(),
  carListingId: integer('carListingId').references(() => CarListing.id, { onDelete: 'cascade' }).notNull()
});

export const CarFeatures = pgTable('carFeatures', {
  id: serial('id').primaryKey(),
  carListingId: integer('carListingId').references(() => CarListing.id, { onDelete: 'cascade' }).notNull(),
  featureName: varchar('featureName', { length: 255 }).notNull()
});
