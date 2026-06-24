import { getUserCarListings } from '../app/actions/carListing';

async function main() {
  const listings = await getUserCarListings('deepanshukhatri2006@gmail.com');
  console.log("Returned listings:", JSON.stringify(listings, null, 2));
}

main().catch(console.error);
