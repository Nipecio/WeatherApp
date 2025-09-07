import { type CurrentWeather, type Forecast, type AirQuality, type GeocodingResult } from "@shared/schema";

export function getWeatherGradient(condition: string): string {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) {
    return 'weather-gradient-sunny';
  } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle') || lowerCondition.includes('thunderstorm')) {
    return 'weather-gradient-rainy';
  } else if (lowerCondition.includes('cloud')) {
    return 'weather-gradient-cloudy';
  } else if (lowerCondition.includes('snow')) {
    return 'weather-gradient-snow';
  } else if (lowerCondition.includes('mist') || lowerCondition.includes('fog') || lowerCondition.includes('haze')) {
    return 'weather-gradient-mist';
  }
  
  return 'weather-gradient-cloudy';
}

export function getWeatherIcon(condition: string, icon?: string): string {
  if (icon) {
    // Map OpenWeatherMap icons to Font Awesome classes
    const iconMap: Record<string, string> = {
      '01d': 'fas fa-sun',
      '01n': 'fas fa-moon',
      '02d': 'fas fa-cloud-sun',
      '02n': 'fas fa-cloud-moon',
      '03d': 'fas fa-cloud',
      '03n': 'fas fa-cloud',
      '04d': 'fas fa-cloud',
      '04n': 'fas fa-cloud',
      '09d': 'fas fa-cloud-rain',
      '09n': 'fas fa-cloud-rain',
      '10d': 'fas fa-cloud-sun-rain',
      '10n': 'fas fa-cloud-moon-rain',
      '11d': 'fas fa-bolt',
      '11n': 'fas fa-bolt',
      '13d': 'fas fa-snowflake',
      '13n': 'fas fa-snowflake',
      '50d': 'fas fa-smog',
      '50n': 'fas fa-smog',
    };
    
    return iconMap[icon] || 'fas fa-cloud';
  }
  
  // Fallback based on condition text
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) {
    return 'fas fa-sun';
  } else if (lowerCondition.includes('rain')) {
    return 'fas fa-cloud-rain';
  } else if (lowerCondition.includes('cloud')) {
    return 'fas fa-cloud';
  } else if (lowerCondition.includes('snow')) {
    return 'fas fa-snowflake';
  } else if (lowerCondition.includes('thunderstorm')) {
    return 'fas fa-bolt';
  } else if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) {
    return 'fas fa-smog';
  }
  
  return 'fas fa-cloud';
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDay(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (minutes < 1) {
    return 'Just now';
  } else if (minutes === 1) {
    return '1 minute ago';
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else {
    const hours = Math.floor(minutes / 60);
    if (hours === 1) {
      return '1 hour ago';
    } else {
      return `${hours} hours ago`;
    }
  }
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return 'text-green-400';
  if (aqi <= 100) return 'text-yellow-400';
  if (aqi <= 150) return 'text-orange-400';
  if (aqi <= 200) return 'text-red-400';
  if (aqi <= 300) return 'text-purple-400';
  return 'text-red-600';
}

export function getUVIndexLevel(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

export function convertTemperature(temp: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') {
    return Math.round((temp * 9/5) + 32);
  }
  return temp;
}

export function getTemperatureUnit(unit: 'celsius' | 'fahrenheit'): string {
  return unit === 'celsius' ? '°C' : '°F';
}
