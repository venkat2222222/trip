# Tourister Trip Planner - Full-Stack Travel Application

A complete, production-ready full-stack travel and tourism web application for **Tourister Trip Planner**. Allows travelers to explore tour packages, discover destinations, design customized trip itineraries, submit bookings, and manage requests while providing travel business owners with a powerful administrative suite.

---

## 🌟 Key Features

### Public Website
- **Modern Travel Landing Page**: Interactive hero banner, global search bar, featured tour packages, popular destinations, and brand value cards.
- **Tour Packages Catalog**: Browse curated tour packages with search keywords, destination filter, max price range slider, max duration, and price sorting.
- **Detailed Package Views**: Full itinerary breakdown, accommodation/transportation/food details, day-by-day accordions, included & excluded item lists, and 1-click **Customize This Trip** quick actions.
- **Explore Destinations**: Destination discovery grid filtered by categories (*Beaches, Mountains, Historical, Religious, Adventure, Wildlife, City, Nature*).
- **Customized Trip Builder**: Multi-step interactive form collecting traveler contact details, travel dates, flexible date options, transportation modes, accommodation levels, room preferences, food requirements, estimated budget, currency, and special requests.
- **Seamless Auth Gate Flow**: Guest users can complete customized trip forms without friction. Upon submitting, draft data is saved to session state, prompting user login/registration and automatically restoring the draft upon authentication.
- **About Us & Contact Us**: Information pages featuring a working contact form that saves submissions into the backend database.

### User Dashboard
- **Profile Summary**: Displays user info and submitted trip requests.
- **Real-Time Request Tracker**: Displays unique request IDs (e.g. `TRIP-2026-X89A`), destinations, travelers, dates, submission timestamp, and status badges (`PENDING`, `REVIEWING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
- **Trip Details Drawer**: Interactive modal allowing users to review full submission specifications for their own trips.

### Admin Dashboard & Management
- **Dashboard Overview Metrics**: Stat cards displaying total registered users, total trip requests, pending requests, confirmed requests, active administrators, and contact messages.
- **User Directory**: View all registered accounts with role indicators (`ROLE_USER`, `ROLE_ADMIN`).
- **Trip Request Management**: Filter trip requests by status, search by customer name/destination/ID, and update request status in real time.
- **Contact Message Viewer**: Access customer inquiries submitted via the Contact Us form.
- **Admin Creation Panel**: Existing administrators can create new administrator accounts with backend authorization enforcement (`ROLE_ADMIN` required).

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Lucide React Icons, Modern Vanilla CSS Design System.
- **Backend**: Java 17+, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, JJWT (JWT authentication), BCrypt Password Hashing, Maven.
- **Database**: PostgreSQL (Production ready) & H2 (In-memory local development default).

---

## 📁 Project Architecture

```
tourister-trip-planner/
├── backend/
│   ├── src/
│   │   ├── main/java/com/tourister/
│   │   │   ├── config/          # SecurityConfig, JwtUtils, JwtAuthFilter
│   │   │   ├── controller/      # Auth, Package, Place, Trip, Contact, Admin Controllers
│   │   │   ├── dto/             # DTO payloads & ApiResponse wrapper
│   │   │   ├── entity/          # JPA Entities (User, TourPackage, Place, TripRequest, ContactMessage)
│   │   │   ├── exception/       # GlobalExceptionHandler & custom exceptions
│   │   │   ├── repository/      # Spring Data JPA repositories with custom JPQL queries
│   │   │   └── service/         # Business services & DataInitializerService
│   │   └── resources/           # application.properties
│   ├── src/test/java/com/tourister/ # Automated Integration & Security Tests
│   ├── pom.xml
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, PackageCard, PlaceCard, LoadingSpinner, etc.
│   │   ├── context/             # AuthContext (JWT state & draft trip storage)
│   │   ├── layouts/             # Public, User Dashboard, & Admin Dashboard Layouts
│   │   ├── pages/               # Home, TourPackages, ExplorePlaces, CustomizeTrip, Dashboards, etc.
│   │   ├── services/            # Fetch API client wrapper
│   │   ├── App.jsx
│   │   └── index.css            # Master travel design system
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── README.md
└── .gitignore
```

---

## 🚀 Local Development Setup

### System Requirements
- **Java JDK**: 17 or higher (tested with Java 23)
- **Node.js**: 18.0.0 or higher
- **Apache Maven**: 3.8+

### 1. Run Backend (Spring Boot)

```bash
cd backend

# Compile & run Spring Boot application
mvn spring-boot:run
```
> **Note**: The backend will start on `http://localhost:8080`. On first run, it automatically seeds:
> - 1 Initial Admin user: `admin@tourister.com` / `Admin@12345`
> - 5 Detailed Tour Packages
> - 10 Popular Travel Destinations

### 2. Run Frontend (React + Vite)

```bash
cd frontend

# Install node dependencies
npm install

# Start Vite development server
npm run dev
```
> The frontend application will be available at `http://localhost:5173`.

---

## 🧪 Testing & Security Verification

Execute backend unit and integration tests to verify authentication, JWT generation, password hashing, user data isolation, and admin-only endpoint protection:

```bash
cd backend
mvn clean test
```

### Verified Security Boundaries:
- `USER` role cannot access `/api/admin/*` endpoints (returns `403 Forbidden`).
- `USER` role cannot create administrator accounts (returns `403 Forbidden`).
- `USER` can only access their own trip requests (`/api/trips/my`).
- `ADMIN` role can update trip statuses and create additional `ADMIN` users.

---

## 🌐 Zero-Cost / Free-Tier Cloud Deployment Guide

This project is built to deploy on free-tier cloud platforms.

### Step 1: PostgreSQL Database (Neon / Supabase)
1. Sign up for a free PostgreSQL database at [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Create a database named `touristerdb` and copy your Connection String URI.

### Step 2: Backend Deployment (Render / Railway)
1. Create a free **Web Service** on [Render.com](https://render.com) connected to your repository.
2. Select **Java** environment and set Root Directory to `backend`.
3. Build Command: `mvn clean package -DskipTests`
4. Start Command: `java -jar target/tourister-backend-1.0.0.jar`
5. Configure Environment Variables in Render:
   - `DATABASE_URL`: `jdbc:postgresql://<your-neon-host>/touristerdb?sslmode=require`
   - `DATABASE_USERNAME`: `<your-db-user>`
   - `DATABASE_PASSWORD`: `<your-db-password>`
   - `DATABASE_DRIVER`: `org.postgresql.Driver`
   - `JPA_DIALECT`: `org.hibernate.dialect.PostgreSQLDialect`
   - `JWT_SECRET`: `<generate-random-256bit-hex>`
   - `INITIAL_ADMIN_EMAIL`: `admin@tourister.com`
   - `INITIAL_ADMIN_PASSWORD`: `<your-secure-admin-password>`
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend-app.vercel.app`

### Step 3: Frontend Deployment (Vercel / Netlify)
1. Create a new project on [Vercel.com](https://vercel.com) connected to your repository.
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Environment Variables in Vercel:
   - `VITE_API_BASE_URL`: `https://your-backend-app.onrender.com/api`

---

## 🔐 Credentials Summary for Testing

- **Initial Seed Admin Account**:
  - **Email**: `admin@tourister.com`
  - **Password**: `Admin@12345`
  - **Admin Login Page**: `http://localhost:5173/admin/login`

- **Sample User Account**:
  - You can register any new account at `http://localhost:5173/register`.
