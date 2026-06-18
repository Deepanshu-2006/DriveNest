DROP TABLE IF EXISTS "carFeatures" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "carImages" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "carListing" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "users" CASCADE;
--> statement-breakpoint
CREATE TABLE "carFeatures" (
	"id" serial PRIMARY KEY NOT NULL,
	"carListingId" integer NOT NULL,
	"featureName" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"imageUrl" text NOT NULL,
	"carListingId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carListing" (
	"id" serial PRIMARY KEY NOT NULL,
	"listingTitle" varchar(255) NOT NULL,
	"tagline" varchar(255),
	"originalPrice" varchar(255),
	"sellingPrice" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"condition" varchar(255) NOT NULL,
	"make" varchar(255) NOT NULL,
	"model" varchar(255) NOT NULL,
	"year" varchar(255) NOT NULL,
	"driveType" varchar(255),
	"transmission" varchar(255) NOT NULL,
	"fuelType" varchar(255) NOT NULL,
	"mileage" varchar(255) NOT NULL,
	"engine" varchar(255),
	"cylinder" varchar(255),
	"color" varchar(255) NOT NULL,
	"door" varchar(255),
	"vin" varchar(255),
	"description" text NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"postedOn" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "carFeatures" ADD CONSTRAINT "carFeatures_carListingId_carListing_id_fk" FOREIGN KEY ("carListingId") REFERENCES "public"."carListing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carImages" ADD CONSTRAINT "carImages_carListingId_carListing_id_fk" FOREIGN KEY ("carListingId") REFERENCES "public"."carListing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carListing" ADD CONSTRAINT "carListing_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;