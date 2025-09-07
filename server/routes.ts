import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  type CurrentWeather,
  type Forecast,
  type AirQuality,
  type GeocodingResult,
  currentWeatherSchema,
  forecastSchema,
  airQualitySchema,
  geocodingResultSchema,
} from "@shared/schema";

const API_KEY = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY || "";

if (!API_KEY) {
  console.error("Warning: OpenWeatherMap API key not found. Set OPENWEATHER_API_KEY environment variable.");
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
}

function getAQIStatus(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current weather by coordinates
  app.get("/api/weather/current/:lat/:lon", async (req, res) => {
    try {
      const { lat, lon } = req.params;
      
      if (!API_KEY) {
        return res.status(500).json({ message: "OpenWeatherMap API key not configured" });
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.status}`);
      }

      const data = await response.json();

      const currentWeather: CurrentWeather = {
        location: {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          name: data.name,
          country: data.sys.country,
          state: data.state,
        },
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: Math.round(data.visibility / 1000), // Convert to km
        windSpeed: Math.round(data.wind?.speed * 3.6 || 0), // Convert m/s to km/h
        windDirection: data.wind?.deg || 0,
        windDirectionText: getWindDirection(data.wind?.deg || 0),
        uvIndex: 0, // Will be fetched separately
        dewPoint: Math.round(data.main.temp - ((100 - data.main.humidity) / 5)),
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        high: Math.round(data.main.temp_max),
        low: Math.round(data.main.temp_min),
        lastUpdated: Date.now(),
      };

      res.json(currentWeather);
    } catch (error) {
      console.error("Error fetching current weather:", error);
      res.status(500).json({ message: "Failed to fetch current weather data" });
    }
  });

  // Get forecast by coordinates
  app.get("/api/weather/forecast/:lat/:lon", async (req, res) => {
    try {
      const { lat, lon } = req.params;
      
      if (!API_KEY) {
        return res.status(500).json({ message: "OpenWeatherMap API key not configured" });
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.status}`);
      }

      const data = await response.json();

      // Process hourly forecast (next 24 hours)
      const hourly = data.list.slice(0, 8).map((item: any) => ({
        time: item.dt,
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
        precipitation: Math.round((item.pop || 0) * 100),
      }));

      // Process daily forecast (group by day)
      const dailyMap = new Map();
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!dailyMap.has(dayKey)) {
          dailyMap.set(dayKey, {
            date: item.dt,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            high: item.main.temp_max,
            low: item.main.temp_min,
            condition: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            precipitation: Math.round((item.pop || 0) * 100),
            temps: [item.main.temp],
          });
        } else {
          const existing = dailyMap.get(dayKey);
          existing.high = Math.max(existing.high, item.main.temp_max);
          existing.low = Math.min(existing.low, item.main.temp_min);
          existing.temps.push(item.main.temp);
        }
      });

      const daily = Array.from(dailyMap.values())
        .slice(0, 5)
        .map((item: any) => ({
          date: item.date,
          day: item.day,
          high: Math.round(item.high),
          low: Math.round(item.low),
          condition: item.condition,
          description: item.description,
          icon: item.icon,
          precipitation: item.precipitation,
        }));

      const forecast: Forecast = { hourly, daily };
      res.json(forecast);
    } catch (error) {
      console.error("Error fetching forecast:", error);
      res.status(500).json({ message: "Failed to fetch forecast data" });
    }
  });

  // Get air quality by coordinates
  app.get("/api/weather/air-quality/:lat/:lon", async (req, res) => {
    try {
      const { lat, lon } = req.params;
      
      if (!API_KEY) {
        return res.status(500).json({ message: "OpenWeatherMap API key not configured" });
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.status}`);
      }

      const data = await response.json();
      const components = data.list[0].components;

      const airQuality: AirQuality = {
        aqi: data.list[0].main.aqi * 20, // Convert to US AQI scale
        status: getAQIStatus(data.list[0].main.aqi * 20),
        pm25: Math.round(components.pm2_5 || 0),
        pm10: Math.round(components.pm10 || 0),
        o3: Math.round(components.o3 || 0),
        no2: Math.round(components.no2 || 0),
        so2: Math.round(components.so2 || 0),
        co: Math.round(components.co || 0),
      };

      res.json(airQuality);
    } catch (error) {
      console.error("Error fetching air quality:", error);
      res.status(500).json({ message: "Failed to fetch air quality data" });
    }
  });

  // Geocoding search
  app.get("/api/weather/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      
      if (!API_KEY) {
        return res.status(500).json({ message: "OpenWeatherMap API key not configured" });
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.status}`);
      }

      const data = await response.json();
      
      const results: GeocodingResult[] = data.map((item: any) => ({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state: item.state,
      }));

      res.json(results);
    } catch (error) {
      console.error("Error searching locations:", error);
      res.status(500).json({ message: "Failed to search locations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
