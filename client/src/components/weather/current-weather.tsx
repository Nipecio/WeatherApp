import { Button } from "@/components/ui/button";
import { MapPin, Thermometer } from "lucide-react";
import { getWeatherGradient, getWeatherIcon, formatRelativeTime, convertTemperature, getTemperatureUnit } from "@/lib/weather";
import type { CurrentWeather } from "@shared/schema";

interface CurrentWeatherProps {
  weather: CurrentWeather;
  tempUnit: 'celsius' | 'fahrenheit';
  onTempUnitChange: (unit: 'celsius' | 'fahrenheit') => void;
}

export function CurrentWeather({ weather, tempUnit, onTempUnitChange }: CurrentWeatherProps) {
  const gradientClass = getWeatherGradient(weather.condition);
  const iconClass = getWeatherIcon(weather.condition, weather.icon);
  const unit = getTemperatureUnit(tempUnit);

  return (
    <div className={`${gradientClass} rounded-2xl p-8 mb-8 text-white relative overflow-hidden`}>
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white opacity-20"></div>
        <div className="absolute top-8 right-8 w-24 h-24 rounded-full border border-white opacity-15"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="mb-6 lg:mb-0">
            {/* Location Display */}
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg" data-testid="text-location">
                {weather.location.name}
              </span>
              <span className="ml-2 text-sm opacity-75" data-testid="text-country">
                {weather.location.country}
              </span>
            </div>
            
            <div className="text-sm opacity-75 mb-4" data-testid="text-last-updated">
              Updated {formatRelativeTime(weather.lastUpdated)}
            </div>
            
            {/* Current Conditions */}
            <div className="flex items-start space-x-8">
              <div>
                <div className="temperature-large" data-testid="text-temperature">
                  {convertTemperature(weather.temperature, tempUnit)}{unit}
                </div>
                <div className="text-lg mb-2" data-testid="text-condition">
                  {weather.condition}
                </div>
                <div className="text-sm opacity-75">
                  Feels like{' '}
                  <span data-testid="text-feels-like">
                    {convertTemperature(weather.feelsLike, tempUnit)}{unit}
                  </span>
                </div>
              </div>
              
              <div className="text-6xl opacity-90 mt-4" data-testid="icon-weather">
                <i className={iconClass}></i>
              </div>
            </div>
          </div>
          
          {/* Temperature Toggle and High/Low */}
          <div className="flex flex-col items-end space-y-4">
            <div className="bg-white/20 rounded-lg p-1 flex">
              <Button
                size="sm"
                variant={tempUnit === 'celsius' ? 'default' : 'ghost'}
                onClick={() => onTempUnitChange('celsius')}
                data-testid="button-celsius"
                className={
                  tempUnit === 'celsius'
                    ? 'bg-white text-accent-foreground hover:bg-white/90'
                    : 'text-white hover:bg-white/20'
                }
              >
                °C
              </Button>
              <Button
                size="sm"
                variant={tempUnit === 'fahrenheit' ? 'default' : 'ghost'}
                onClick={() => onTempUnitChange('fahrenheit')}
                data-testid="button-fahrenheit"
                className={
                  tempUnit === 'fahrenheit'
                    ? 'bg-white text-accent-foreground hover:bg-white/90'
                    : 'text-white hover:bg-white/20'
                }
              >
                °F
              </Button>
            </div>
            
            {/* High/Low temperatures */}
            <div className="text-right">
              <div className="text-sm opacity-75">Today</div>
              <div className="text-lg">
                <span data-testid="text-high">
                  {convertTemperature(weather.high, tempUnit)}{unit}
                </span>
                {' '}/ {' '}
                <span data-testid="text-low" className="opacity-75">
                  {convertTemperature(weather.low, tempUnit)}{unit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
