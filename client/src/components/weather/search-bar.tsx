import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { GeocodingResult } from "@shared/schema";

interface SearchBarProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search locations
  const { data: searchResults, isLoading } = useQuery<GeocodingResult[]>({
    queryKey: ['/api/weather/search', debouncedQuery],
    enabled: debouncedQuery.length >= 2,
  });

  useEffect(() => {
    setIsOpen(searchResults && searchResults.length > 0 && debouncedQuery.length >= 2);
  }, [searchResults, debouncedQuery]);

  const handleLocationSelect = (result: GeocodingResult) => {
    onLocationSelect(result.lat, result.lon);
    setSearchQuery(`${result.name}, ${result.country}`);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={searchQuery}
          onChange={handleInputChange}
          data-testid="input-search"
          className="pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
              Searching...
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="py-1">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.lat}-${result.lon}-${index}`}
                  onClick={() => handleLocationSelect(result)}
                  data-testid={`button-location-${index}`}
                  className="w-full px-3 py-2 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.state ? `${result.state}, ` : ''}{result.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : debouncedQuery.length >= 2 ? (
            <div className="p-3 text-center text-muted-foreground">
              No locations found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
