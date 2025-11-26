require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, UserRole } = require('../models/User');
const { RoomListing, RoomType, ListingStatus } = require('../models/RoomListing');

// Sample room images - actual room/apartment photos from Unsplash
const roomImages = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', // Living room
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', // Apartment interior
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', // Bedroom
  'https://images.unsplash.com/photo-1484154218962-a197022b25ba?w=800&q=80', // Bedroom with bed
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', // Modern living room
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', // Living space
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80', // Bedroom design
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', // Living room sofa
  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80', // Room interior
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80', // Bedroom setup
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', // Modern room
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80', // Cozy bedroom
  'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&q=80', // Apartment room
  'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80', // Indian style room
  'https://images.unsplash.com/photo-1598928506311-c55ez361540d?w=800&q=80', // Simple bedroom
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', // Kitchen
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80', // Furnished room
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', // Apartment bedroom
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80', // Hotel style room
  'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80', // Modern living
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
        description: getRandomElement(descriptions),
        imageUrl: getRandomElement(roomImages),
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
