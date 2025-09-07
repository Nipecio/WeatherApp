import { Clock } from "lucide-react";
import { getWeatherIcon, formatTime, convertTemperature, getTemperatureUnit } from "@/lib/weather";
import type { Forecast } from "@shared/schema";

interface HourlyForecastProps {
  forecast: Forecast;
  tempUnit: 'celsius' | 'fahrenheit';
}

export function HourlyForecast({ forecast, tempUnit }: HourlyForecastProps) {
  const unit = getTemperatureUnit(tempUnit);

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-primary" />
        Today's Hourly Forecast
      </h3>
      
      <div className="forecast-scroll overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          {forecast.hourly.map((hour, index) => {
            const iconClass = getWeatherIcon(hour.condition, hour.icon);
            const timeText = index === 0 ? 'Now' : formatTime(hour.time);
            
            return (
              <div
                key={hour.time}
                className="flex-shrink-0 text-center p-3 hover:bg-secondary/50 rounded-lg transition-colors min-w-[80px]"
                data-testid={`card-hourly-${index}`}
              >
                <div className="text-sm text-muted-foreground mb-2" data-testid={`text-hourly-time-${index}`}>
                  {timeText}
                </div>
                <i className={`${iconClass} text-xl text-amber-400 mb-2`} data-testid={`icon-hourly-${index}`}></i>
                <div className="font-semibold" data-testid={`text-hourly-temp-${index}`}>
                  {convertTemperature(hour.temperature, tempUnit)}{unit}
                </div>
                <div className="text-xs text-muted-foreground mt-1" data-testid={`text-hourly-precipitation-${index}`}>
                  {hour.precipitation}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
