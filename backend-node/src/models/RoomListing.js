const mongoose = require('mongoose');

const RoomType = {
  ROOM_1RK: 'ROOM_1RK',
  ROOM_1BHK: 'ROOM_1BHK',
  SHARED: 'SHARED',
  SINGLE: 'SINGLE',
  DOUBLE: 'DOUBLE',
  TRIPLE: 'TRIPLE',
  FLAT: 'FLAT'
};

const ListingStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

const roomListingSchema = new mongoose.Schema({
  area: {
    type: String,
    required: true,
    trim: true
  },
  rent: {
    type: Number,
    required: true,
    min: 0
  },
  deposit: {
    type: Number,
    required: true,
    min: 0
  },
  roomType: {
    type: String,
    enum: Object.values(RoomType),
    required: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  imageUrl: {
    type: String
  },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{8,12}$/.test(v);
      },
      message: 'Enter valid phone number (8-12 digits)'
    }
  },
  status: {
    type: String,
    enum: Object.values(ListingStatus),
    default: ListingStatus.APPROVED
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient search
roomListingSchema.index({ area: 'text' });
roomListingSchema.index({ status: 1, area: 1, rent: 1, roomType: 1 });

const RoomListing = mongoose.model('RoomListing', roomListingSchema);

module.exports = { RoomListing, RoomType, ListingStatus };
