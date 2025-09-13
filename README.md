# Room Link - Broker-Free Room Rental Platform

[![Java](https://img.shields.io/badge/Java-17+-orange.svg?logo=java)](https://www.oracle.com/java/technologies/downloads/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg?logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791.svg?logo=postgresql)](https://www.postgresql.org/)

**Room Link** connects room owners and renters directly in Pune without any broker fees. Find or list rooms easily with our simple web platform.

---

## 🖼️ Platform Screenshots

### Homepage - Search & Browse Rooms
![Homepage Demo](https://github.com/sanikapawar74/Room-Link/blob/main/img-1.png)
*Search for rooms with filters and view them on an interactive map*

### List Your Property
![List Property Demo](https://github.com/sanikapawar74/Room-Link/blob/main/img-2.png)
*Easy form to list your room with photos and details*

---

## Why Room Link?

**The Problem**: Brokers in Pune charge 1-2 months rent as commission and make the rental process complicated.

**Our Solution**: Connect directly with room owners. No broker fees, no hassle.

## Key Features

- 🏠 **Browse Rooms** - View available rooms with photos and details
- 🗺️ **Map Search** - Find rooms by location on interactive map
- 📝 **List Your Room** - Easy form to post your room for rent
- 🔐 **Secure Login** - Safe user accounts with password protection
- 📱 **Mobile Friendly** - Works great on phones and computers
- 💰 **Zero Commission** - No fees for owners or renters

## Tech Stack

- **Frontend**: React, Material-UI, Leaflet Maps
- **Backend**: Spring Boot, Java 17
- **Database**: PostgreSQL
- **Security**: JWT Authentication

---

## Getting Started

### What You Need
- Java 17+
- Node.js 18+
- Docker

### Quick Setup

1. **Download the project**
   ```bash
   git clone https://github.com/sanikapawar74/Room-Link.git
   cd Room-Link
   ```

2. **Setup Database**
   ```bash
   docker-compose up -d
   ```

3. **Start Backend**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

4. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Open your browser** to `http://localhost:5173`

---

## API Routes

### User Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Room Listings
- `GET /api/listings` - View all rooms
- `POST /api/listings` - Add new room (login required)
- `PUT /api/listings/{id}` - Edit your room (login required)
- `DELETE /api/listings/{id}` - Delete your room (login required)

### File Upload
- `POST /api/upload/image` - Upload room photos (login required)

---

## Project Structure

```
Room-Link/
├── backend/          # Spring Boot API
├── frontend/         # React Web App
├── docker-compose.yml
└── README.md
```

---

## Contributing

Want to help improve Room Link? Great!

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Test everything works
5. Submit a pull request

---

## Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/sanikapawar74/Room-Link/issues)
- **Email**: your-email@example.com

---

<div align="center">

**Made for the Pune rental community**

[⭐ Star this project](https://github.com/sanikapawar74/Room-Link) | [🐛 Report Issues](https://github.com/sanikapawar74/Room-Link/issues)

</div>