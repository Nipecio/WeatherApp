import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CurrentWeather } from "@/components/weather/current-weather";
import { Forecast } from "@/components/weather/forecast";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { WeatherDetails } from "@/components/weather/weather-details";
import { SearchBar } from "@/components/weather/search-bar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CloudSun, MapPin, Settings } from "lucide-react";
import type { CurrentWeather as CurrentWeatherType, Forecast as ForecastType, AirQuality } from "@shared/schema";

export default function WeatherPage() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [tempUnit, setTempUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const { toast } = useToast();

  // Get current weather
  const { data: currentWeather, isLoading: isLoadingWeather, error: weatherError } = useQuery<CurrentWeatherType>({
    queryKey: ['/api/weather/current', location?.lat, location?.lon],
    enabled: !!location,
  });

  // Get forecast
  const { data: forecast, isLoading: isLoadingForecast } = useQuery<ForecastType>({
    queryKey: ['/api/weather/forecast', location?.lat, location?.lon],
    enabled: !!location,
  });

  // Get air quality
  const { data: airQuality, isLoading: isLoadingAirQuality } = useQuery<AirQuality>({
    queryKey: ['/api/weather/air-quality', location?.lat, location?.lon],
    enabled: !!location,
  });

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to San Francisco if geolocation fails
          setLocation({ lat: 37.7749, lon: -122.4194 });
          toast({
            title: "Location access denied",
            description: "Using default location. Allow location access for local weather.",
          });
        }
      );
    } else {
      // Default to San Francisco if geolocation is not supported
      setLocation({ lat: 37.7749, lon: -122.4194 });
      toast({
        title: "Geolocation not supported",
        description: "Using default location.",
      });
    }
  }, [toast]);

  const handleLocationSelect = (lat: number, lon: number) => {
    setLocation({ lat, lon });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          toast({
            title: "Location updated",
            description: "Weather data refreshed for your current location.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location error",
            description: "Unable to get your current location. Please try again.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const isLoading = isLoadingWeather || isLoadingForecast || isLoadingAirQuality;

  if (weatherError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Weather data unavailable</h1>
          <p className="text-muted-foreground mb-4">
            {weatherError.message || "Unable to fetch weather data. Please try again later."}
          </p>
          <Button onClick={() => window.location.reload()} data-testid="button-retry">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <CloudSun className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">WeatherScope</h1>
            </div>
            
            <div className="flex-1 max-w-md mx-8">
              <SearchBar onLocationSelect={handleLocationSelect} />
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCurrentLocation}
                data-testid="button-current-location"
                className="hover:bg-secondary"
              >
                <MapPin className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-settings"
                className="hover:bg-secondary"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentWeather ? (
          <>
            <CurrentWeather 
              weather={currentWeather} 
              tempUnit={tempUnit}
              onTempUnitChange={setTempUnit}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {forecast && (
                  <>
                    <Forecast forecast={forecast} tempUnit={tempUnit} />
                    <HourlyForecast forecast={forecast} tempUnit={tempUnit} />
                  </>
                )}
              </div>
              
              <div className="space-y-6">
                <WeatherDetails 
                  weather={currentWeather} 
                  airQuality={airQuality}
                  tempUnit={tempUnit}
                />
              </div>
            </div>
          </>
        ) : isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading weather data...</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <CloudSun className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Search for a location</h2>
              <p className="text-muted-foreground">Enter a city name to get weather information</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-sm text-muted-foreground">
                Weather data provided by OpenWeatherMap API
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Live data</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {currentWeather ? (
                new Date(currentWeather.lastUpdated).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
              ) : 'Never'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
