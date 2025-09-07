import { Calendar } from "lucide-react";
import { getWeatherIcon, formatDay, formatDate, convertTemperature, getTemperatureUnit } from "@/lib/weather";
import type { Forecast } from "@shared/schema";

interface ForecastProps {
  forecast: Forecast;
  tempUnit: 'celsius' | 'fahrenheit';
}

export function Forecast({ forecast, tempUnit }: ForecastProps) {
  const unit = getTemperatureUnit(tempUnit);

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-primary" />
        5-Day Forecast
      </h3>
      
      <div className="space-y-3">
        {forecast.daily.map((day, index) => {
          const iconClass = getWeatherIcon(day.condition, day.icon);
          const dayText = formatDay(day.date);
          const dateText = formatDate(day.date);
          
          return (
            <div
              key={day.date}
              className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors"
              data-testid={`card-forecast-${index}`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 text-center">
                  <div className="font-medium" data-testid={`text-day-${index}`}>
                    {dayText}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`text-date-${index}`}>
                    {dateText}
                  </div>
                </div>
                <i className={`${iconClass} text-2xl text-amber-400`} data-testid={`icon-forecast-${index}`}></i>
                <div>
                  <div className="font-medium" data-testid={`text-forecast-condition-${index}`}>
                    {day.condition}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`text-forecast-description-${index}`}>
                    {day.description}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold" data-testid={`text-forecast-temps-${index}`}>
                  {convertTemperature(day.high, tempUnit)}{unit} / {convertTemperature(day.low, tempUnit)}{unit}
                </div>
                <div className="text-sm text-muted-foreground" data-testid={`text-forecast-precipitation-${index}`}>
                  Precipitation: {day.precipitation}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
