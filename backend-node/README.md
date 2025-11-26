# RoomLink Backend (Node.js)

A Node.js/Express backend for the RoomLink application with MongoDB database.

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud like MongoDB Atlas)

## Setup

1. Install dependencies:
```bash
cd backend-node
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values as needed:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure secret key for JWT tokens
     - `PORT`: Server port (default: 8080)
     - `CORS_ORIGIN`: Frontend URL for CORS (default: http://localhost:5173)

3. Start MongoDB:
   - For local MongoDB: `mongod`
   - Or use MongoDB Atlas cloud service

4. Run the server:
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Listings
- `GET /api/listings` - Get all approved listings (with optional filters)
  - Query params: `area`, `minRent`, `maxRent`, `roomType`, `page`, `size`
- `GET /api/listings/:id` - Get a specific listing
- `POST /api/listings` - Create a new listing (requires auth)
- `GET /api/listings/my-listings` - Get current user's listings (requires auth)

### Upload
- `POST /api/upload` - Upload an image file (returns URL)

### Health Check
- `GET /health` - Server health check

## Project Structure

```
backend-node/
├── src/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   ├── models/
│   │   ├── User.js        # User model
│   │   └── RoomListing.js # Room listing model
│   ├── routes/
│   │   ├── auth.js        # Auth routes
│   │   ├── listings.js    # Listing routes
│   │   └── upload.js      # File upload routes
│   └── server.js          # Main entry point
├── uploads/               # Uploaded files directory
├── .env                   # Environment variables
├── .env.example           # Example environment file
└── package.json
```

## Notes

- The server runs on port 8080 by default (same as the old Java backend)
- JWT tokens expire in 7 days by default
- Uploaded files are served from `/uploads/` path
- CORS is configured for the frontend at localhost:5173
