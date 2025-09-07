import { Info, Eye, Droplet, Wind, Gauge, Sun, Thermometer, Sunrise, Sunset, Moon, Leaf } from "lucide-react";
import { formatTime, getAQIColor, getUVIndexLevel, convertTemperature, getTemperatureUnit } from "@/lib/weather";
import type { CurrentWeather, AirQuality } from "@shared/schema";

interface WeatherDetailsProps {
  weather: CurrentWeather;
  airQuality?: AirQuality;
  tempUnit: 'celsius' | 'fahrenheit';
}

export function WeatherDetails({ weather, airQuality, tempUnit }: WeatherDetailsProps) {
  const unit = getTemperatureUnit(tempUnit);

  return (
    <div className="space-y-6">
      {/* Weather Details Grid */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-primary" />
          Weather Details
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-secondary/30 rounded-lg" data-testid="card-visibility">
            <div className="flex items-center mb-1">
              <Eye className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">Visibility</span>
            </div>
            <div className="text-xl font-semibold" data-testid="text-visibility">
              {weather.visibility} km
            </div>
          </div>
          
          <div className="p-3 bg-secondary/30 rounded-lg" data-testid="card-humidity">
            <div className="flex items-center mb-1">
              <Droplet className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">Humidity</span>
            </div>
            <div className="text-xl font-semibold" data-testid="text-humidity">
              {weather.humidity}%
            </div>
          </div>
          
          <div className="p-3 bg-secondary/30 rounded-lg" data-testid="card-wind">
            <div className="flex items-center mb-1">
              <Wind className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">Wind</span>
            </div>
            <div className="text-xl font-semibold" data-testid="text-wind-speed">
              {weather.windSpeed} km/h
            </div>
            <div className="text-xs text-muted-foreground" data-testid="text-wind-direction">
              {weather.windDirectionText}
            </div>
          </div>
          
          <div className="p-3 bg-secondary/30 rounded-lg" data-testid="card-pressure">
            <div className="flex items-center mb-1">
              <Gauge className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">Pressure</span>
            </div>
            <div className="text-xl font-semibold" data-testid="text-pressure">
              {weather.pressure}
            </div>
            <div className="text-xs text-muted-foreground">hPa</div>
          </div>
          
          <div className="p-3 bg-secondary/30 rounded-lg" data-testid="card-uv-index">
            <div className="flex items-center mb-1">
              <Sun className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">UV Index</span>
            </div>
            <div className="text-xl font-semibold" data-testid="text-uv-index">
              {weather.uvIndex}
            </div>
            <div className="text-xs text-muted-foreground" data-testid="text-uv-level">
              {getUVIndexLevel(weather.uvIndex)}
            </div>
          </div>
          
          <div className="p-3 bg-secondary/30 rounded-lg" data-testid="card-dew-point">
            <div className="flex items-center mb-1">
              <Thermometer className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">Dew Point</span>
            </div>
            <div className="text-xl font-semibold" data-testid="text-dew-point">
              {convertTemperature(weather.dewPoint, tempUnit)}{unit}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sun & Moon */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Sun className="w-5 h-5 mr-2 text-primary" />
          Sun & Moon
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg" data-testid="card-sunrise">
            <div className="flex items-center">
              <Sunrise className="w-5 h-5 text-amber-400 mr-3" />
              <span>Sunrise</span>
            </div>
            <span className="font-medium" data-testid="text-sunrise">
              {formatTime(weather.sunrise)}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg" data-testid="card-sunset">
            <div className="flex items-center">
              <Sunset className="w-5 h-5 text-orange-400 mr-3" />
              <span>Sunset</span>
            </div>
            <span className="font-medium" data-testid="text-sunset">
              {formatTime(weather.sunset)}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg" data-testid="card-moon-phase">
            <div className="flex items-center">
              <Moon className="w-5 h-5 text-blue-300 mr-3" />
              <span>Moon Phase</span>
            </div>
            <span className="font-medium" data-testid="text-moon-phase">
              Waning Crescent
            </span>
          </div>
        </div>
      </div>
      
      {/* Air Quality */}
      {airQuality && (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-primary" />
            Air Quality
          </h3>
          
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-2">
              <span className={`text-2xl font-bold ${getAQIColor(airQuality.aqi)}`} data-testid="text-aqi">
                {airQuality.aqi}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">AQI</div>
            <div className={`font-medium ${getAQIColor(airQuality.aqi)}`} data-testid="text-aqi-status">
              {airQuality.status}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-secondary/30 rounded" data-testid="card-pm25">
              <div className="text-muted-foreground">PM2.5</div>
              <div className="font-medium" data-testid="text-pm25">
                {airQuality.pm25}
              </div>
            </div>
            <div className="text-center p-2 bg-secondary/30 rounded" data-testid="card-pm10">
              <div className="text-muted-foreground">PM10</div>
              <div className="font-medium" data-testid="text-pm10">
                {airQuality.pm10}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
