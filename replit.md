# Overview

This is a memorial web application dedicated to Terry A. Davis, the creator of TempleOS. The application serves as both a tribute and an educational platform, featuring a biographical section about Terry's life and work, a virtual machine emulator for running TempleOS, and a legacy section highlighting his impact on the programming community. The application uses a retro terminal aesthetic with green-on-black styling to honor the TempleOS visual design.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom terminal-themed color palette and Courier Prime monospace font
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ES modules
- **File Structure**: Separated into server, client, and shared directories
- **API Design**: RESTful endpoints for VM sessions, file uploads, and user management
- **File Uploads**: Multer middleware for handling ISO file uploads (up to 4GB)
- **Error Handling**: Centralized error middleware with proper HTTP status codes

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Storage Implementation**: Dual storage approach with in-memory storage (MemStorage) for development and PostgreSQL for production
- **File Storage**: Local filesystem storage for uploaded ISO files

## Database Schema
- **Users Table**: User authentication with username/password
- **VM Sessions Table**: Virtual machine configurations including memory, CPU cores, ISO file associations, and status tracking
- **Uploaded Files Table**: Metadata for uploaded ISO files including original names, file sizes, and MIME types

## Virtual Machine Emulation
- **VM Emulator**: Custom JavaScript-based TempleOS emulator with canvas rendering
- **Display**: 640x480 VGA resolution with 16-color palette simulation
- **Boot Sequence**: Animated terminal-style boot sequence with TempleOS branding
- **Session Management**: VM state persistence and lifecycle management

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Security**: Basic username/password authentication (ready for enhancement)
- **User Management**: User creation and retrieval through storage abstraction layer

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client for Neon Database
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database migration and schema management tools

### UI and Styling
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for components
- **lucide-react**: Icon library

### Development and Build Tools
- **vite**: Fast build tool and dev server
- **@vitejs/plugin-react**: React support for Vite
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds

### File Handling
- **multer**: Multipart form data handling for file uploads
- **@types/multer**: TypeScript definitions for Multer

### Data Management
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling with validation
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation

### Session and Storage
- **connect-pg-simple**: PostgreSQL session store for Express
- **express-session**: Session middleware (implied dependency)

### Development Experience
- **@replit/vite-plugin-runtime-error-modal**: Runtime error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment