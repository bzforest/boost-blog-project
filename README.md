# Boost Blog - Next-Generation Content Platform

A modern, high-performance blog platform built with Next.js 15, Express, Prisma, and Supabase. Designed for speed, SEO, and exceptional user experience.

## 🚀 Architecture Overview

This project implements a decoupled architecture separating the presentation layer from the business logic layer, ensuring scalability, maintainability, and clean separation of concerns.

- **Frontend (Client/SSR):** Next.js 15 (App Router)
  - Leverages React Server Components for optimal SEO and initial load performance.
  - Implements a robust Design System using Tailwind CSS v4 and Lucide Icons.
  - Client-side interactivity (e.g., 3D flip cards, lightbox galleries, real-time UI updates).
- **Backend (API):** Express.js & Node.js
  - RESTful API architecture serving as the core business logic layer.
  - Integration with Prisma ORM for type-safe database queries.
  - Secure JWT-based authentication via HTTP-only cookies.
- **Database & Storage:** PostgreSQL & Supabase
  - Relational database schema optimized for read-heavy operations.
  - Supabase Storage integration for handling rich media and image uploads.

## ✨ Key Features

- **Dynamic Content Delivery:** Fast, paginated blog listing with skeleton loaders and smooth transitions.
- **Rich Media Support:** Integrated image gallery with an interactive Lightbox modal.
- **Interactive Comments System:** Real-time form validation (Thai language / numbers only constraint), optimistic UI updates, and deep-nested UI replies.
- **Comprehensive Admin Dashboard:**
  - Secure authentication workflow.
  - Complete CMS capabilities: Create, Read, Update, Delete, Publish/Unpublish.
  - Custom URL Slug editing for SEO.
  - Comment moderation portal (Approve/Reject workflows).
- **Responsive & Accessible Design:**
  - Fluid typography and scalable layouts.
  - Device-specific UX enhancements (e.g., Hover-to-flip on Desktop, Tap-to-flip on Mobile).

## 🛠 Tech Stack

- **Framework:** Next.js 15, React 19
- **Styling:** Tailwind CSS v4
- **Backend:** Node.js, Express.js
- **Database & ORM:** PostgreSQL, Prisma
- **Storage:** Supabase Storage
- **Validation:** Zod
- **Date Formatting:** date-fns

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Supabase account (for storage)

### Environment Variables Configuration

**Backend (`apps/backend/.env`)**
```env
# Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
DATABASE_URL="DATABASE_URL"

# Connect to Postgres via the shared session-mode pooler (used for migrations)
DIRECT_URL="DIRECT_URL"

# Supabase Storage Keys
SUPABASE_URL="SUPABASE_URL"
SUPABASE_SERVICE_ROLE_KEY="SUPABASE_SERVICE_ROLE_KEY"

# Auth Secrets
JWT_SECRET="your-super-secret-jwt-key"

# ADMIN METIER
SECRET_TRIGGER="your-secret-code"
DEMO_EMAIL="your-email"
DEMO_PASSCODE="your-passcode"
```

**Frontend (`apps/frontend/.env.local`)**
```env
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

DATABASE_URL="DATABASE_URL"
DIRECT_URL="DIRECT_URL"

```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd boost-blog
   ```

2. **Backend Setup**
   ```bash
   cd apps/backend
   npm install
   npx prisma db push
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd apps/frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:4000`

## 🧪 Developer Tools

- **Swagger API Documentation:**
  - An interactive API playground is available when the backend is running.
  - Access it at: `http://localhost:4000/api-docs`
- **Design System Showcase:**
  - Explore the core UI components and design tokens used throughout the project.
  - Access it at: `http://localhost:3000/design-system`

## 🏗 System Design & Optimization

The system is designed with reuse in mind. A core `src/components/shared` directory houses agnostic UI components (e.g., `BlogCard`, `CommentCard`) that can be seamlessly integrated across both public-facing and administrative interfaces without duplicating styles or logic. This shared component architecture drastically reduces technical debt and accelerates future feature development.