import { db } from '../configs/db.js';
import { Users, CarListing, CarImages, CarFeatures } from '../configs/schema.js';
import { eq } from 'drizzle-orm';

const carsData = [
  {
    listingTitle: "Porsche 911 Carrera S",
    tagline: "Pure sports car performance and icon design",
    originalPrice: "135000",
    sellingPrice: "125000",
    category: "Coupe",
    condition: "Certified Pre-Owned",
    make: "Porsche",
    model: "911 Carrera S",
    year: "2025",
    driveType: "RWD",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "4500",
    engine: "3.0L",
    cylinder: "6",
    color: "Chalk Gray",
    door: "2",
    vin: "WP0AA2A9XFS110022",
    description: "Immaculate Porsche 911 Carrera S with premium options, sport exhaust system, and full leather interior. Clean title, one owner, fully dealer maintained.",
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600",
    features: ["Leather Seats", "Navigation System", "Heated Seats", "Apple CarPlay", "Premium Sound System"]
  },
  {
    listingTitle: "Tesla Model S Plaid",
    tagline: "Unmatched electric power and zero-to-sixty acceleration",
    originalPrice: "94990",
    sellingPrice: "89000",
    category: "Electric",
    condition: "New",
    make: "Tesla",
    model: "Model S Plaid",
    year: "2026",
    driveType: "AWD",
    transmission: "Automatic",
    fuelType: "Electric",
    mileage: "12",
    engine: "Electric",
    cylinder: "0",
    color: "Solid Black",
    door: "4",
    vin: "5YJSA1E21PFP10029",
    description: "Brand new Tesla Model S Plaid with yoke steering, tri-motor all-wheel drive, and 1020 horsepower. Experience the future of speed today.",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600",
    features: ["Autopilot", "Sunroof", "Heated Seats", "Backup Camera", "Premium Sound System", "Lane Departure Warning"]
  },
  {
    listingTitle: "BMW M3 Competition",
    tagline: "Track-ready dynamics in a luxury sedan format",
    originalPrice: "85000",
    sellingPrice: "78000",
    category: "Sedan",
    condition: "Used",
    make: "BMW",
    model: "M3 Competition",
    year: "2024",
    driveType: "AWD",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "14200",
    engine: "3.0L",
    cylinder: "6",
    color: "Alpine White",
    door: "4",
    vin: "WBS43AY05PFP10034",
    description: "BMW M3 Competition in perfect running condition. Carbon fiber interior trim, adaptive M suspension, and carbon ceramic brakes.",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600",
    features: ["Leather Seats", "Apple CarPlay", "Navigation System", "Heated Seats", "Keyless Entry"]
  },
  {
    listingTitle: "Audi Q7 55 TFSI",
    tagline: "Spacious luxury three-row SUV for the family",
    originalPrice: "71000",
    sellingPrice: "65000",
    category: "SUV",
    condition: "New",
    make: "Audi",
    model: "Q7",
    year: "2025",
    driveType: "AWD",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "15",
    engine: "3.0L",
    cylinder: "6",
    color: "Mythos Black Metallic",
    door: "5",
    vin: "WA1AAAFV7RD002231",
    description: "Brand new Audi Q7 SUV equipped with virtual cockpit, adaptive air suspension, and premium executive packages. Ultimate cargo and cabin luxury.",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
    features: ["Panoramic Sunroof", "Third Row Seating", "360 Camera", "Heated Seats", "Apple CarPlay", "Blind Spot Monitor"]
  },
  {
    listingTitle: "Mercedes-Benz C-Class C300",
    tagline: "Eco-conscious mild hybrid with premium cabin tech",
    originalPrice: "48500",
    sellingPrice: "42000",
    category: "Sedan",
    condition: "Certified Pre-Owned",
    make: "Mercedes",
    model: "C-Class C300",
    year: "2023",
    driveType: "RWD",
    transmission: "Automatic",
    fuelType: "Hybrid",
    mileage: "9800",
    engine: "2.0L",
    cylinder: "4",
    color: "Obsidian Black",
    door: "4",
    vin: "W1KWF4KB5PF002931",
    description: "Certified Pre-Owned Mercedes C300 with 11.9-inch center screen display, active parking assist, ambient lighting, and dynamic select drive modes.",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600",
    features: ["Apple CarPlay", "Ambient Lighting", "Backup Camera", "Keyless Entry", "Heated Seats"]
  },
  {
    listingTitle: "Toyota Camry Hybrid",
    tagline: "Legendary reliability meets high-efficiency hybrid tech",
    originalPrice: "34500",
    sellingPrice: "32000",
    category: "Hybrid",
    condition: "New",
    make: "Toyota",
    model: "Camry Hybrid",
    year: "2025",
    driveType: "FWD",
    transmission: "Automatic",
    fuelType: "Hybrid",
    mileage: "8",
    engine: "2.5L",
    cylinder: "4",
    color: "Celestial Silver",
    door: "4",
    vin: "4T1G11AK8RU001293",
    description: "Save on fuel with this highly comfortable, brand new Camry Hybrid. Achieves up to 50 MPG. Features include pre-collision mitigation and lane assist.",
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=600",
    features: ["Lane Keep Assist", "Apple CarPlay", "Adaptive Cruise Control", "Backup Camera"]
  },
  {
    listingTitle: "Ford F-150 Raptor",
    tagline: "High-performance off-road pickup truck built for anything",
    originalPrice: "79000",
    sellingPrice: "72000",
    category: "Truck",
    condition: "Used",
    make: "Ford",
    model: "F-150 Raptor",
    year: "2024",
    driveType: "4WD",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "18500",
    engine: "3.5L",
    cylinder: "6",
    color: "Code Orange",
    door: "4",
    vin: "1FTFW1RG7PFA00329",
    description: "Ford F-150 Raptor with Fox Racing shocks, 37-inch performance tires, panoramic sunroof, and heavy-duty towing package. Ready for off-road trail fun.",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600",
    features: ["Four-Wheel Drive", "Panoramic Sunroof", "Towing Package", "360 Camera", "Heated Seats"]
  },
  {
    listingTitle: "Aston Martin DB11 Volante",
    tagline: "Exquisite open-air grand touring engineering",
    originalPrice: "210000",
    sellingPrice: "190000",
    category: "Convertible",
    condition: "Certified Pre-Owned",
    make: "Aston Martin",
    model: "DB11",
    year: "2023",
    driveType: "RWD",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "6200",
    engine: "4.0L",
    cylinder: "8",
    color: "Frosted Glass Blue",
    door: "2",
    vin: "SCFBC3AY0JG002931",
    description: "Aston Martin DB11 Volante convertible with hand-stitched leather interior, dark trim accents, and roaring twin-turbo V8 engine.",
    imageUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=600",
    features: ["Convertible Soft Top", "Leather Seats", "Navigation System", "Premium Sound System", "Ventilated Seats"]
  },
  {
    listingTitle: "Lamborghini Aventador S",
    tagline: "V12 performance masterpiece with futuristic aesthetics",
    originalPrice: "380000",
    sellingPrice: "350000",
    category: "Coupe",
    condition: "Used",
    make: "Lamborghini",
    model: "Aventador S",
    year: "2022",
    driveType: "AWD",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "3100",
    engine: "6.5L",
    cylinder: "12",
    color: "Giallo Orion (Yellow)",
    door: "2",
    vin: "ZHWEC1ZD3NLA00129",
    description: "Stunning Lamborghini Aventador S with scissor doors, complete Alcantara sport seating, carbon fiber trim panels, and standard V12 engine exhaust system.",
    imageUrl: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=600",
    features: ["Carbon Fiber Details", "Premium sound system", "Lifting System", "Scissor Doors"]
  },
  {
    listingTitle: "Honda Civic Type R",
    tagline: "The absolute standard for hot-hatch performance engineering",
    originalPrice: "46500",
    sellingPrice: "43000",
    category: "Hatchback",
    condition: "New",
    make: "Honda",
    model: "Civic Type R",
    year: "2025",
    driveType: "FWD",
    transmission: "Manual",
    fuelType: "Petrol",
    mileage: "18",
    engine: "2.0L",
    cylinder: "4",
    color: "Championship White",
    door: "5",
    vin: "JHMFL5H38PX003291",
    description: "Brand new Honda Civic Type R with the iconic red interior bucket seats, 6-speed manual transmission with auto rev-match, and triple center exhaust tip layout.",
    imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600",
    features: ["Manual Transmission", "Sport Seats", "Apple CarPlay", "Brembo Brakes", "Adaptive Cruise Control"]
  },
  {
    listingTitle: "Hyundai i20 N Line",
    tagline: "Highly practical and fuel efficient city hatchback",
    originalPrice: "6500",
    sellingPrice: "4800",
    category: "Hatchback",
    condition: "Used",
    make: "Hyundai",
    model: "i20",
    year: "2019",
    driveType: "FWD",
    transmission: "Manual",
    fuelType: "Petrol",
    mileage: "48500",
    engine: "1.2L",
    cylinder: "4",
    color: "Fiery Red",
    door: "5",
    vin: "MALH351BLKM003291",
    description: "Extremely reliable Hyundai i20 N Line with low running costs, great fuel economy, and full maintenance history records. Ideal first car or city runabout.",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600",
    features: ["Manual Transmission", "Bluetooth Connection", "Backup Sensors", "Fuel Efficiency Mode"]
  },
  {
    listingTitle: "Tesla Model Y Performance",
    tagline: "Best selling electric utility crossover in the world",
    originalPrice: "52490",
    sellingPrice: "48000",
    category: "SUV",
    condition: "New",
    make: "Tesla",
    model: "Model Y",
    year: "2025",
    driveType: "AWD",
    transmission: "Automatic",
    fuelType: "Electric",
    mileage: "15",
    engine: "Electric",
    cylinder: "0",
    color: "Pearl White Multi-Coat",
    door: "5",
    vin: "5YJYGDEE7PF002931",
    description: "Brand new Model Y Performance crossover with carbon fiber spoiler, lowered suspension, 21-inch Überturbine wheels, and exceptional electric range capabilities.",
    imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600",
    features: ["Autopilot", "Panoramic Glass Roof", "Heated Steering Wheel", "Heated Seats", "360 Protection Camera"]
  },
  {
    listingTitle: "Mercedes-Benz Sprinter Cargo",
    tagline: "Commercial grade utility van customized for travel and cargo",
    originalPrice: "56000",
    sellingPrice: "52000",
    category: "Van",
    condition: "New",
    make: "Mercedes",
    model: "Sprinter",
    year: "2024",
    driveType: "RWD",
    transmission: "Automatic",
    fuelType: "Diesel",
    mileage: "35",
    engine: "2.0L",
    cylinder: "4",
    color: "Arctic White",
    door: "4",
    vin: "WD3PF4CD6RE003291",
    description: "Brand new Mercedes Sprinter high-roof cargo van with spacious interior volume. Exceptional platform for delivery services or custom RV camper van buildout.",
    imageUrl: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&q=80&w=600",
    features: ["High Roof", "Backup Camera", "Keyless Start", "Lane Keep Assist", "Blind Spot Sensor"]
  },
  {
    listingTitle: "Chevrolet Corvette C8 Z06",
    tagline: "American supercar performance with mid-engine physics",
    originalPrice: "119000",
    sellingPrice: "110000",
    category: "Convertible",
    condition: "Used",
    make: "Chevrolet",
    model: "Corvette Z06",
    year: "2024",
    driveType: "RWD",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "2400",
    engine: "5.5L",
    cylinder: "8",
    color: "Torch Red",
    door: "2",
    vin: "1G1YC2D68RF003291",
    description: "American mid-engine masterpiece with high-revving naturally aspirated V8. Features include carbon fiber package, front lift kit, and convertible hardtop.",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600",
    features: ["Convertible Hardtop", "Supercar Engine", "Performance Exhaust", "Leather Heated Seats", "Head-Up Display"]
  },
  {
    listingTitle: "Porsche Taycan 4S",
    tagline: "Stunning electric performance layout with premium build quality",
    originalPrice: "108000",
    sellingPrice: "98000",
    category: "Electric",
    condition: "Certified Pre-Owned",
    make: "Porsche",
    model: "Taycan 4S",
    year: "2024",
    driveType: "AWD",
    transmission: "Automatic",
    fuelType: "Electric",
    mileage: "8200",
    engine: "Electric",
    cylinder: "0",
    color: "Frozen Blue Metallic",
    door: "4",
    vin: "WP0AB2Y15PFP002931",
    description: "Certified Pre-Owned Porsche Taycan 4S electric sedan in like-new condition. Fast charging capabilities, performance battery plus, and surround view cameras.",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600",
    features: ["Panoramic Roof", "Surround View Cameras", "Apple CarPlay", "Adaptive Cruise Control", "Premium Sound System"]
  },
  {
    listingTitle: "Toyota RAV4 Hybrid Limited",
    tagline: "The ultimate compact family hybrid SUV",
    originalPrice: "37500",
    sellingPrice: "34000",
    category: "SUV",
    condition: "New",
    make: "Toyota",
    model: "RAV4 Hybrid",
    year: "2025",
    driveType: "AWD",
    transmission: "Automatic",
    fuelType: "Hybrid",
    mileage: "9",
    engine: "2.5L",
    cylinder: "4",
    color: "Magnetic Gray Metallic",
    door: "5",
    vin: "JTMWRRFV9RD003291",
    description: "Toyota RAV4 Hybrid Limited with all-wheel drive, dual zone climate controls, premium heated and ventilated softTex seats, and standard Toyota Safety Sense 2.5 package.",
    imageUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=600",
    features: ["All Wheel Drive", "Ventilated Seats", "Blind Spot Monitor", "Power Liftgate", "Sunroof"]
  },
  {
    listingTitle: "Volvo XC90 Recharge Ultimate",
    tagline: "Eco-friendly plugin hybrid luxury three-row SUV",
    originalPrice: "72500",
    sellingPrice: "62000",
    category: "SUV",
    condition: "Certified Pre-Owned",
    make: "Volvo",
    model: "XC90",
    year: "2024",
    driveType: "AWD",
    transmission: "Automatic",
    fuelType: "Hybrid",
    mileage: "8500",
    engine: "2.0L",
    cylinder: "4",
    color: "Thunder Gray",
    door: "5",
    vin: "YV4ED22S1P1003291",
    description: "Certified plugin hybrid Volvo XC90 Ultimate seating up to 7. Premium Harman Kardon sound system, pilot assist self driving support, and up to 32 miles of pure electric range.",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
    features: ["Harman Kardon Sound", "Plugin Hybrid Charging", "Adaptive Pilot Assist", "Leather Comfort Seats", "Sunroof"]
  },
  {
    listingTitle: "Mazda MX-5 Miata Club",
    tagline: "Classic rear-wheel-drive roadster convertible built for corners",
    originalPrice: "31500",
    sellingPrice: "28000",
    category: "Convertible",
    condition: "Used",
    make: "Mazda",
    model: "MX-5 Miata",
    year: "2023",
    driveType: "RWD",
    transmission: "Manual",
    fuelType: "Petrol",
    mileage: "9800",
    engine: "2.0L",
    cylinder: "4",
    color: "Soul Red Crystal Metallic",
    door: "2",
    vin: "JM1ND2A78P0032911",
    description: "Mazda MX-5 Miata Club edition with Brembo brakes, BBS performance wheels, Recaro sport seating, and clean shifting 6-speed manual transmission.",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600",
    features: ["Manual 6-Speed", "Brembo Brakes", "BBS Wheels", "Recaro Seats", "Convertible Top"]
  }
];

async function seed() {
  console.log("Seeding database start...");
  try {
    // 1. Get or create a seeder user
    let userRecords = await db.select().from(Users).limit(1);
    let userId;
    
    if (userRecords.length === 0) {
      console.log("No users found in database. Creating seeder user...");
      const newUser = await db.insert(Users).values({
        email: 'seeder@drivenest.com',
        name: 'DriveNest Seeder',
        postedOn: new Date().toLocaleDateString()
      }).returning({ id: Users.id });
      userId = newUser[0].id;
      console.log(`Created seeder user with ID: ${userId}`);
    } else {
      userId = userRecords[0].id;
      console.log(`Using existing user with ID: ${userId} (Email: ${userRecords[0].email})`);
    }

    // Delete existing listings of the seeder user to avoid duplicate listings
    console.log(`Cleaning up old listings for user ID ${userId}...`);
    await db.delete(CarListing).where(eq(CarListing.userId, userId));

    // 2. Loop through cars data and insert Listings, Images, and Features
    for (const car of carsData) {
      console.log(`Inserting car listing: ${car.listingTitle}...`);
      
      const insertResult = await db.insert(CarListing).values({
        listingTitle: car.listingTitle,
        tagline: car.tagline,
        originalPrice: car.originalPrice,
        sellingPrice: car.sellingPrice,
        category: car.category,
        condition: car.condition,
        make: car.make,
        model: car.model,
        year: car.year,
        driveType: car.driveType,
        transmission: car.transmission,
        fuelType: car.fuelType,
        mileage: car.mileage,
        engine: car.engine,
        cylinder: car.cylinder,
        color: car.color,
        door: car.door,
        vin: car.vin,
        description: car.description,
        userId: userId
      }).returning({ id: CarListing.id });

      const carListingId = insertResult[0].id;

      // Insert primary image
      await db.insert(CarImages).values({
        imageUrl: car.imageUrl,
        carListingId: carListingId
      });

      // Insert features
      if (car.features && car.features.length > 0) {
        const featureInserts = car.features.map(f => ({
          carListingId: carListingId,
          featureName: f
        }));
        await db.insert(CarFeatures).values(featureInserts);
      }
    }
    
    console.log("Database seeded successfully with 18 premium listings!");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
}

seed();
