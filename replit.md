# Overview

This is a weather application built with pure HTML, CSS, and JavaScript that provides comprehensive weather information including current conditions, forecasts, and air quality data. The app features a modern, responsive interface with location search functionality, temperature unit conversion, and detailed weather metrics. It integrates with the OpenWeatherMap API to fetch real-time weather data from actual weather stations worldwide.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Pure HTML5** with semantic markup for accessibility
- **Modern CSS3** with custom properties, flexbox, and grid layouts
- **Vanilla JavaScript (ES6+)** for all interactive functionality
- **Responsive design** that works on mobile, tablet, and desktop
- **Dark theme** as the default with weather-based gradient backgrounds

## API Integration
- **Direct OpenWeatherMap API calls** using the Fetch API
- **Coordinate-based queries** for weather information (lat/lon parameters)
- **Geocoding search** functionality for location discovery
- **Error handling** with user-friendly error messages
- **Loading states** and smooth transitions

## External Service Integration
- **OpenWeatherMap API** for comprehensive weather data including:
  - Current weather conditions
  - 5-day weather forecasts
  - Hourly weather forecasts
  - Air quality data
  - Geocoding for location search
- **Geolocation API** for automatic location detection
- **FontAwesome icons** via CDN for weather icons
- **Google Fonts** for typography

## Browser Compatibility
- **Modern browsers** supporting ES6+ features
- **Responsive design** with mobile-first approach
- **Progressive enhancement** for older browser support
- **Cross-browser testing** for consistent experience

## Deployment Options
- **Static hosting** compatible with any web server
- **VS Code Live Server** for local development
- **GitHub Pages** for free hosting
- **Netlify, Vercel, or similar** static hosting services

# File Structure

- **index.html** - Complete weather application in a single file
  - HTML structure and content
  - CSS styles and responsive design
  - JavaScript functionality and API integration
- **replit.md** - Project documentation and preferences