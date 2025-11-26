require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, UserRole } = require('../models/User');
const { RoomListing, RoomType, ListingStatus } = require('../models/RoomListing');

// Sample room images - unique real room/apartment photos
const roomImages = [
  'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?w=800',   // Bedroom with bed
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=800',   // Modern living room
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?w=800',   // Cozy bedroom
  'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?w=800',   // Apartment interior
  'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?w=800',   // Bedroom design
  'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?w=800',   // Studio apartment
  'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?w=800',   // Room with desk
  'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?w=800',   // Living space
  'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?w=800',   // Minimalist room
  'https://images.pexels.com/photos/1776574/pexels-photo-1776574.jpeg?w=800',   // Bedroom with wardrobe
  'https://images.pexels.com/photos/1909791/pexels-photo-1909791.jpeg?w=800',   // Modern bedroom
  'https://images.pexels.com/photos/2029731/pexels-photo-2029731.jpeg?w=800',   // Furnished room
  'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?w=800',   // Apartment bedroom
  'https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?w=800',   // Clean bedroom
  'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?w=800',   // Room interior
  'https://images.pexels.com/photos/2227832/pexels-photo-2227832.jpeg?w=800',   // Bright room
  'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?w=800',   // Cozy apartment
  'https://images.pexels.com/photos/2360673/pexels-photo-2360673.jpeg?w=800',   // Bachelor room
  'https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?w=800',   // Simple room
  'https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?w=800',   // Student room
  'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?w=800',   // Rental room
  'https://images.pexels.com/photos/2747901/pexels-photo-2747901.jpeg?w=800',   // Flat interior
  'https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg?w=800',   // Shared room
  'https://images.pexels.com/photos/3144580/pexels-photo-3144580.jpeg?w=800',   // PG room
  'https://images.pexels.com/photos/3209045/pexels-photo-3209045.jpeg?w=800',   // 1BHK flat
];

const puneAreas = [
  'Kothrud', 'Baner', 'Aundh', 'Viman Nagar', 'Koregaon Park',
  'Kalyani Nagar', 'Magarpatta', 'Hadapsar', 'Wakad', 'Hinjawadi',
  'Pimpri', 'Chinchwad', 'Kharadi', 'Pashan', 'Shivaji Nagar', 'Camp'
];

// Coordinates for Pune areas (approximate)
const areaCoordinates = {
  'Kothrud': { lat: 18.5074, lng: 73.8077 },
  'Baner': { lat: 18.5590, lng: 73.7868 },
  'Aundh': { lat: 18.5580, lng: 73.8073 },
  'Viman Nagar': { lat: 18.5679, lng: 73.9143 },
  'Koregaon Park': { lat: 18.5362, lng: 73.8939 },
  'Kalyani Nagar': { lat: 18.5463, lng: 73.9020 },
  'Magarpatta': { lat: 18.5142, lng: 73.9270 },
  'Hadapsar': { lat: 18.5089, lng: 73.9260 },
  'Wakad': { lat: 18.5997, lng: 73.7627 },
  'Hinjawadi': { lat: 18.5912, lng: 73.7380 },
  'Pimpri': { lat: 18.6279, lng: 73.8009 },
  'Chinchwad': { lat: 18.6298, lng: 73.7997 },
  'Kharadi': { lat: 18.5511, lng: 73.9407 },
  'Pashan': { lat: 18.5353, lng: 73.8035 },
  'Shivaji Nagar': { lat: 18.5308, lng: 73.8475 },
  'Camp': { lat: 18.5141, lng: 73.8803 }
};

const roomTypes = ['ROOM_1RK', 'ROOM_1BHK', 'SHARED', 'SINGLE', 'DOUBLE'];

const descriptions = [
  'Spacious and well-ventilated room with attached bathroom. Close to bus stop and metro station. 24/7 water supply and power backup available.',
  'Fully furnished room with AC, bed, wardrobe and study table. Ideal for working professionals. Grocery stores and restaurants nearby.',
  'Cozy room in a peaceful locality. Security deposit negotiable. Parking space available. No brokers involved.',
  'Modern apartment with balcony and great city view. Gym and swimming pool in the society. Gated community with 24/7 security.',
  'Budget-friendly room perfect for students. WiFi included. Laundry facilities available. Walking distance to colleges.',
  'Newly renovated flat with modular kitchen. Semi-furnished with basic amenities. Pet-friendly society.',
  'Premium room in a prime location. Close to IT parks and shopping malls. Maintenance included in rent.',
  'Comfortable sharing accommodation for bachelors. Clean and hygienic environment. Common kitchen available.',
  'Independent room with separate entrance. No restrictions on timing. Suitable for night shift employees.',
  'Well-maintained flat in a family-friendly society. Kids play area and garden. Near good schools.',
  'Affordable room with basic furnishing. Electricity and water charges extra. Immediate availability.',
  'Luxurious 1BHK with premium interiors. Air conditioned throughout. Reserved parking spot included.',
  'Simple and clean room for single occupancy. Home-cooked food available nearby. Safe locality for women.',
  'Bright room with natural light. Quiet neighborhood perfect for WFH professionals. High-speed internet ready.',
  'Compact but efficient living space. All essentials within walking distance. Great for minimalists.'
];

const sampleUsers = [
  { email: 'rahul.sharma@gmail.com', password: 'password123' },
  { email: 'priya.patel@gmail.com', password: 'password123' },
  { email: 'amit.kumar@gmail.com', password: 'password123' },
  { email: 'sneha.deshmukh@gmail.com', password: 'password123' },
  { email: 'vikram.joshi@gmail.com', password: 'password123' },
  { email: 'anita.reddy@gmail.com', password: 'password123' },
  { email: 'suresh.patil@gmail.com', password: 'password123' },
  { email: 'kavita.singh@gmail.com', password: 'password123' },
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhoneNumber() {
  return '98' + String(getRandomInt(10000000, 99999999));
}

function addRandomOffset(coord, maxOffset = 0.01) {
  return coord + (Math.random() - 0.5) * maxOffset * 2;
}

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await RoomListing.deleteMany({});

    // Create users
    console.log('Creating sample users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User({
        email: userData.email,
        password: userData.password,
        role: UserRole.REPORTER
      });
      await user.save();
      createdUsers.push(user);
      console.log(`  Created user: ${userData.email}`);
    }

    // Create listings
    console.log('Creating sample listings...');
    const listings = [];
    
    // Shuffle images to ensure uniqueness
    const shuffledImages = [...roomImages].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < 25; i++) {
      const area = getRandomElement(puneAreas);
      const coords = areaCoordinates[area];
      const roomType = getRandomElement(roomTypes);
      const baseRent = roomType === 'SHARED' ? getRandomInt(4000, 8000) :
                       roomType === 'ROOM_1RK' ? getRandomInt(6000, 12000) :
                       roomType === 'ROOM_1BHK' ? getRandomInt(10000, 20000) :
                       getRandomInt(5000, 15000);
      
      const listing = new RoomListing({
        area: area,
        rent: Math.round(baseRent / 500) * 500, // Round to nearest 500
        deposit: Math.round(baseRent * getRandomInt(1, 3) / 1000) * 1000, // 1-3 months deposit
        roomType: roomType,
        description: descriptions[i % descriptions.length], // Use unique descriptions
        imageUrl: shuffledImages[i % shuffledImages.length], // Use unique images
        contactNumber: generatePhoneNumber(),
        status: ListingStatus.APPROVED,
        latitude: addRandomOffset(coords.lat),
        longitude: addRandomOffset(coords.lng),
        reporter: getRandomElement(createdUsers)._id,
        createdAt: new Date(Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000) // Random date within last 30 days
      });
      
      await listing.save();
      listings.push(listing);
      console.log(`  Created listing #${i + 1}: ${roomType} in ${area} - ₹${listing.rent}/month`);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log(`   - ${createdUsers.length} users created`);
    console.log(`   - ${listings.length} listings created`);
    console.log('\n📧 Sample login credentials:');
    console.log('   Email: rahul.sharma@gmail.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

seed();
