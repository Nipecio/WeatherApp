# Overview

This is a weather application built with React and Express.js that provides comprehensive weather information including current conditions, forecasts, and air quality data. The app features a modern, responsive interface with location search functionality, temperature unit conversion, and detailed weather metrics. It integrates with the OpenWeatherMap API to fetch real-time weather data and includes a full-featured UI component library using shadcn/ui with Radix UI primitives.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for the client-side application
- **Vite** as the build tool and development server with hot module replacement
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management, caching, and data fetching
- **shadcn/ui** component library built on top of Radix UI primitives for accessible components
- **Tailwind CSS** for styling with custom CSS variables for theming
- **Dark theme** as the default with a comprehensive design system

## Backend Architecture
- **Express.js** server with TypeScript for the REST API
- **Modular route handling** with dedicated routes file for weather endpoints
- **In-memory storage** implementation with interface-based design for easy database migration
- **Environment-based configuration** with development and production modes
- **Request logging middleware** with duration tracking and response capture

## Data Storage Solutions
- **Drizzle ORM** configured for PostgreSQL with schema definitions in TypeScript
- **Neon Database** serverless PostgreSQL integration ready for deployment
- **In-memory storage fallback** for development and testing
- **Database migrations** managed through Drizzle Kit

## API Design Patterns
- **RESTful endpoints** for weather data retrieval
- **Coordinate-based queries** for weather information (lat/lon parameters)
- **Geocoding search** functionality for location discovery
- **Zod schema validation** for type-safe API responses and data validation
- **Error handling middleware** with standardized error responses
- **CORS and security headers** configured for production deployment

## External Service Integration
- **OpenWeatherMap API** for comprehensive weather data including:
  - Current weather conditions
  - 5-day weather forecasts
  - Hourly weather forecasts
  - Air quality data
  - Geocoding for location search
- **Environment variable management** for API keys and configuration
- **Rate limiting considerations** built into the query client configuration

## Development Tooling
- **TypeScript** for type safety across the entire application
- **Path aliases** configured for clean imports (@/, @shared/, etc.)
- **ESLint and Prettier** configuration for code quality
- **Hot reload** in development with Vite and tsx
- **Build optimization** with separate client and server bundling

## State Management Strategy
- **Server state** handled by TanStack Query with intelligent caching
- **Local UI state** managed with React hooks
- **Temperature unit preference** as local state
- **Location coordinates** as application state
- **Toast notifications** for user feedback

# External Dependencies

## Core Framework Dependencies
- **React 18** - Frontend framework with concurrent features
- **Express.js** - Backend web framework
- **TypeScript** - Type safety across the application
- **Vite** - Build tool and development server

## UI and Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library
- **class-variance-authority** - Utility for creating component variants

## Data Fetching and State Management
- **TanStack Query** - Server state management and caching
- **Zod** - Schema validation and type inference

## Database and ORM
- **Drizzle ORM** - Type-safe SQL toolkit
- **@neondatabase/serverless** - Serverless PostgreSQL driver
- **Drizzle Kit** - Database migration and schema management tools

## Weather API Integration
- **OpenWeatherMap API** - Weather data provider requiring API key configuration

## Development Tools
- **tsx** - TypeScript execution for development
- **esbuild** - Fast JavaScript bundler for production builds
- **PostCSS** - CSS processing with Tailwind CSS integration

## Replit Integration
- **@replit/vite-plugin-runtime-error-modal** - Enhanced error reporting in development
- **@replit/vite-plugin-cartographer** - Development tooling for the Replit environment