import { z } from "zod";

export const weatherLocationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  name: z.string(),
  country: z.string(),
  state: z.string().optional(),
});

export const currentWeatherSchema = z.object({
  location: weatherLocationSchema,
  temperature: z.number(),
  feelsLike: z.number(),
  condition: z.string(),
  description: z.string(),
  icon: z.string(),
  humidity: z.number(),
  pressure: z.number(),
  visibility: z.number(),
  windSpeed: z.number(),
  windDirection: z.number(),
  windDirectionText: z.string(),
  uvIndex: z.number(),
  dewPoint: z.number(),
  sunrise: z.number(),
  sunset: z.number(),
  high: z.number(),
  low: z.number(),
  lastUpdated: z.number(),
});

export const hourlyForecastItemSchema = z.object({
  time: z.number(),
  temperature: z.number(),
  condition: z.string(),
  icon: z.string(),
  precipitation: z.number(),
});

export const dailyForecastItemSchema = z.object({
  date: z.number(),
  day: z.string(),
  high: z.number(),
  low: z.number(),
  condition: z.string(),
  description: z.string(),
  icon: z.string(),
  precipitation: z.number(),
});

export const forecastSchema = z.object({
  hourly: z.array(hourlyForecastItemSchema),
  daily: z.array(dailyForecastItemSchema),
});

export const airQualitySchema = z.object({
  aqi: z.number(),
  status: z.string(),
  pm25: z.number(),
  pm10: z.number(),
  o3: z.number(),
  no2: z.number(),
  so2: z.number(),
  co: z.number(),
});

export const geocodingResultSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});

export type WeatherLocation = z.infer<typeof weatherLocationSchema>;
export type CurrentWeather = z.infer<typeof currentWeatherSchema>;
export type HourlyForecastItem = z.infer<typeof hourlyForecastItemSchema>;
export type DailyForecastItem = z.infer<typeof dailyForecastItemSchema>;
export type Forecast = z.infer<typeof forecastSchema>;
export type AirQuality = z.infer<typeof airQualitySchema>;
export type GeocodingResult = z.infer<typeof geocodingResultSchema>;
