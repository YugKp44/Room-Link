const express = require('express');
const { RoomListing, ListingStatus } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/listings - Get approved listings with optional filters
router.get('/', async (req, res) => {
  try {
    const { area, minRent, maxRent, roomType, page = 0, size = 20 } = req.query;
    
    // Build query
    const query = { status: ListingStatus.APPROVED };
    
    if (area) {
      query.area = { $regex: area, $options: 'i' };
    }
    
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }
    
    if (roomType) {
      query.roomType = roomType;
    }

    const pageNum = Math.max(0, parseInt(page));
    const pageSize = Math.min(100, Math.max(1, parseInt(size)));

    const listings = await RoomListing.find(query)
      .populate('reporter', '_id email')
      .sort({ createdAt: -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize);

    const response = listings.map(formatListingResponse);
    res.json(response);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error fetching listings' });
  }
});

// GET /api/listings/my-listings - Get current user's listings (requires auth)
// NOTE: This route must be defined BEFORE /:id to avoid conflict
router.get('/my-listings', authenticate, async (req, res) => {
  try {
    const listings = await RoomListing.find({ reporter: req.user._id })
      .populate('reporter', '_id email')
      .sort({ createdAt: -1 });

    const response = listings.map(formatListingResponse);
    res.json(response);
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ message: 'Server error fetching your listings' });
  }
});

// GET /api/listings/:id - Get listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await RoomListing.findById(req.params.id)
      .populate('reporter', '_id email');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(formatListingResponse(listing));
  } catch (error) {
    console.error('Get listing error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(500).json({ message: 'Server error fetching listing' });
  }
});

// POST /api/listings - Create new listing (requires auth)
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      area,
      rent,
      deposit,
      roomType,
      description,
      imageUrl,
      contactNumber,
      latitude,
      longitude
    } = req.body;

    // Validate required fields
    if (!area || rent === undefined || deposit === undefined || !roomType || !contactNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate contact number
    if (!/^\d{8,12}$/.test(contactNumber)) {
      return res.status(400).json({ message: 'Enter valid phone number (8-12 digits)' });
    }

    const listing = new RoomListing({
      area,
      rent,
      deposit,
      roomType,
      description,
      imageUrl,
      contactNumber,
      latitude,
      longitude,
      status: ListingStatus.APPROVED,
      reporter: req.user._id
    });

    await listing.save();
    await listing.populate('reporter', '_id email');

    res.status(201).json(formatListingResponse(listing));
  } catch (error) {
    console.error('Create listing error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error creating listing' });
  }
});

// Helper function to format listing response
function formatListingResponse(listing) {
  return {
    id: listing._id,
    area: listing.area,
    rent: listing.rent,
    deposit: listing.deposit,
    roomType: listing.roomType,
    description: listing.description,
    imageUrl: listing.imageUrl,
    contactNumber: listing.contactNumber,
    status: listing.status,
    latitude: listing.latitude,
    longitude: listing.longitude,
    reporterId: listing.reporter?._id || listing.reporter,
    createdAt: listing.createdAt
  };
}

module.exports = router;
