# DRIPLENS WEB

```
  ____  ____  ___ ____  _     _____ _   _ ____
 |  _ \|  _ \|_ _|  _ \| |   | ____| \ | / ___|
 | | | | |_) || || |_) | |   |  _| |  \| \___ \
 | |_| |  _ < | ||  __/| |___| |___| |\  |___) |
 |____/|_| \_\___|_|   |_____|_____|_| \_|____/
```

**The professional meritocracy for videographers and content creators.**

Driplens is a full-stack MERN web platform that connects videographers and content creators with brands through merit-based discovery. Creators build portfolios, brands browse talent, and both parties communicate through a structured hiring system — all in one place.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Team](#team)

---

## Overview

Driplens removes the noise from creator-brand partnerships. Instead of cold DMs and inflated follower counts, brands discover creators through actual work — portfolios, category, and track record. Creators get hired on merit.

The platform is split into two independent apps:

- `client/` — React frontend built with Vite, Tailwind CSS, and Framer Motion
- `server/` — Express REST API backed by MongoDB Atlas and Cloudinary

---

## Tech Stack

### Frontend

| Technology          | Purpose                              |
|---------------------|--------------------------------------|
| React 19            | UI framework                         |
| Vite 8              | Build tool and dev server            |
| Tailwind CSS 4      | Utility-first styling                |
| Framer Motion       | Page and component animations        |
| GSAP                | Advanced scroll and timeline effects |
| React Router DOM 7  | Client-side routing                  |
| Lucide React        | Icon system                          |
| Styled Components   | Component-level scoped styles        |

### Backend

| Technology   | Purpose                              |
|--------------|--------------------------------------|
| Node.js      | Runtime                              |
| Express 5    | HTTP server and routing              |
| MongoDB       | Primary database                     |
| Mongoose     | ODM and schema validation            |
| Cloudinary   | Media storage (images and video)     |
| Multer       | Multipart file upload handling       |
| JSON Web Token | Auth token issuance and verification |
| bcrypt       | Password hashing                     |

---

## Project Structure

```
DRIPLENS-WEB/
|
+-- client/                         # React frontend
|   +-- src/
|   |   +-- components/
|   |   |   +-- AnimatedButton.jsx  # Reusable CTA button with animation
|   |   |   +-- ClickSpark.jsx      # Global canvas click-spark effect
|   |   |   +-- Navbar.jsx          # Top navigation bar
|   |   |   +-- Footer.jsx          # Site footer
|   |   |
|   |   +-- pages/
|   |   |   +-- LandingPage.jsx     # Hero, stats, how-it-works, CTA
|   |   |   +-- AuthPage.jsx        # Login / Register (creator & brand)
|   |   |   +-- CreatorsPage.jsx    # Public creator discovery listing
|   |   |   +-- BrandsPage.jsx      # Brand directory
|   |   |   +-- CreatorProfilePage.jsx  # Individual creator portfolio view
|   |   |   +-- CreatorDashboard.jsx    # Creator account management
|   |   |   +-- BrandDashboard.jsx      # Brand hiring management
|   |   |   +-- MessagingPage.jsx       # In-app messaging between parties
|   |   |
|   |   +-- App.jsx                 # Root router and layout
|   |   +-- main.jsx                # Entry point
|   |
|   +-- vite.config.js
|   +-- package.json
|
+-- server/                         # Express REST API
    +-- index.js                    # App bootstrap, DB connect, middleware
    +-- middleware/
    |   +-- auth.js                 # JWT requireAuth + requireRole guards
    +-- models/
    |   +-- User.js                 # User schema (creator / brand roles)
    |   +-- HiringRequest.js        # Brand-to-creator project requests
    |   +-- Message.js              # Messages scoped to hiring requests
    +-- routes/
    |   +-- auth.js                 # POST /register, POST /login
    |   +-- upload.js               # POST /portfolio (Cloudinary upload)
    +-- utils/
    |   +-- cloudinary.js           # Cloudinary SDK wrapper
    +-- package.json
```

---

## Features

### For Creators
- Register with a creator role and build a public profile
- Upload portfolio pieces (image and video) via Cloudinary
- Get discovered by brands browsing the creator directory
- Receive and respond to hiring requests
- Chat with brands through the messaging system

### For Brands
- Register with a brand role and access the brand dashboard
- Browse and filter creators by category and location
- Send hiring requests with project title, description, and budget
- Manage request status (Pending, Accepted, Declined, Completed, Review)
- Message creators directly within a request thread

### Platform-wide
- JWT-based authentication with 7-day token expiry
- Role-based route protection (creator vs. brand middleware guards)
- Click-spark canvas animation on every interaction
- Framer Motion and GSAP powered transitions throughout
- Fully white, clean UI with no dark elements
- Responsive layout from mobile upward

---

## API Reference

**Base URL:** `http://localhost:5000/api`

### Auth

```
POST   /auth/register     Register a new user (creator or brand)
POST   /auth/login        Login and receive a JWT token
GET    /api/health        Check server status
```

**Register body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "creator | brand"
}
```

**Login body:**
```json
{
  "email": "string",
  "password": "string"
}
```

Both return:
```json
{
  "token": "<JWT>",
  "user": { "id", "username", "email", "role" }
}
```

### Upload (protected)

```
POST   /upload/portfolio     Upload a portfolio media file to Cloudinary
```

Requires `Authorization: Bearer <token>` header. Accepts `multipart/form-data` with field `media`. Returns the Cloudinary `secure_url`, `public_id`, and `resource_type`.

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (or local MongoDB instance)
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/PRE-GENERATION/DRIPLENS-WEB.git
cd DRIPLENS-WEB
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:

```bash
npm run dev        # development with nodemon
npm start          # production
```

### 3. Set up the client

```bash
cd ../client
npm install
npm run dev
```

The client runs on `http://localhost:5173` by default. The server runs on port `5000`.

---

## Environment Variables

| Variable                   | Location | Description                         |
|----------------------------|----------|-------------------------------------|
| `PORT`                     | server   | Express server port (default 5000)  |
| `MONGO_URI`                | server   | MongoDB connection string           |
| `JWT_SECRET`               | server   | Secret key for signing JWTs         |
| `CLOUDINARY_CLOUD_NAME`    | server   | Cloudinary cloud identifier         |
| `CLOUDINARY_API_KEY`       | server   | Cloudinary API key                  |
| `CLOUDINARY_API_SECRET`    | server   | Cloudinary API secret               |

---

## Database Models

### User
```
username      String     unique, required
email         String     unique, required
password      String     bcrypt hashed
role          String     "creator" or "brand"
isVerified    Boolean    default false
profile {
  bannerUrl   String
  avatarUrl   String
  bio         String
  location    String
  category    String
  portfolio   [ { title, mediaUrl, mediaType } ]
}
```

### HiringRequest
```
brandId             ObjectId  -> User
creatorId           ObjectId  -> User
projectTitle        String
projectDescription  String
budget              Number
status              "Pending" | "Accepted" | "Declined" | "Completed" | "Review"
```

### Message
```
hiringRequestId     ObjectId  -> HiringRequest
senderId            ObjectId  -> User
content             String
isRead              Boolean   default false
```

---

## Team

| Name               | Role                    |
|--------------------|-------------------------|
| Aayu               | Frontend + Architecture |
| Annanya Ukey       | Development             |
| Atharv Gadekar     | Development             |
| Aditi Janugade     | Development             |
| Anandi Khandelwal  | Development             |

Faculty Guide — Prof. N.D. Gaikwad, AISSMS College of Engineering

---

## Deployment

The recommended free-tier deployment stack:

| Service         | Purpose              |
|-----------------|----------------------|
| Vercel          | Frontend hosting     |
| Render          | Backend hosting      |
| MongoDB Atlas   | Database (free tier) |
| Cloudinary      | Media storage        |

---

*DRIPLENS — Built at AISSMS College of Engineering, Pune.*
