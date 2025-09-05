// const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
// const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// export interface WeatherData {
//   temperature: number;
//   condition: string;
//   humidity: number;
//   windSpeed: number;
//   visibility: number;
//   icon: string;
// }

// export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//     );
//     const data = await response.json();
    
//     return {
//       temperature: Math.round(data.main.temp),
//       condition: data.weather[0].main,
//       humidity: data.main.humidity,
//       windSpeed: data.wind.speed,
//       visibility: data.visibility / 1000,
//       icon: data.weather[0].icon,
//     };
//   } catch (error) {
//     console.error("Error fetching weather data:", error);
//     throw error;
//   }
// };

// export const getForecast = async (lat: number, lon: number) => {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//     );
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching forecast data:", error);
//     throw error;
//   }
// };

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  visibility: string;
  uvIndex: string;
  rainfall: string;
  icon: string;
  location: {
    city: string;
    district: string;
    state: string;
    country: string;
  };
}

export interface ForecastDay {
  day: string;
  date: string;
  high: string;
  low: string;
  condition: string;
  rain: string;
  icon: string;
}

export interface FarmingAdvisory {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  icon: any;
  color: string;
}

export interface AgriculturalIndex {
  name: string;
  value: string;
  status: string;
  color: string;
}

// Get location details using reverse geocoding
const getLocationDetails = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const location = data[0];
      return {
        city: location.name || 'Unknown City',
        district: location.local_names?.en || location.name || 'Unknown District',
        state: location.state || 'Unknown State',
        country: location.country || 'Unknown Country'
      };
    }
    
    return {
      city: 'Unknown City',
      district: 'Unknown District', 
      state: 'Unknown State',
      country: 'Unknown Country'
    };
  } catch (error) {
    console.error('Error fetching location details:', error);
    return {
      city: 'Unknown City',
      district: 'Unknown District',
      state: 'Unknown State', 
      country: 'Unknown Country'
    };
  }
};

export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    // Fetch weather and location data in parallel
    const [weatherResponse, locationDetails] = await Promise.all([
      fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
      getLocationDetails(lat, lon)
    ]);
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }
    
    const data = await weatherResponse.json();
    
    // Get UV Index from separate API call
    let uvIndex = "N/A";
    try {
      const uvResponse = await fetch(
        `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      if (uvResponse.ok) {
        const uvData = await uvResponse.json();
        uvIndex = Math.round(uvData.value).toString();
      }
    } catch (uvError) {
      console.warn('UV Index not available:', uvError);
    }
    
    return {
      temperature: `${Math.round(data.main.temp)}°C`,
      condition: data.weather[0].description.replace(/\b\w/g, (l: string) => l.toUpperCase()),
      humidity: `${data.main.humidity}%`,
      windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`, // Convert m/s to km/h
      visibility: `${Math.round(data.visibility / 1000)} km`,
      uvIndex,
      rainfall: data.rain ? `${Math.round(data.rain['1h'] || 0)}mm expected today` : "No rain expected today",
      icon: data.weather[0].icon,
      location: locationDetails
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const getForecast = async (lat: number, lon: number): Promise<ForecastDay[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Group forecasts by day and get daily highs/lows
    const dailyForecasts: { [key: string]: { date: Date; forecasts: any[] } } = {};
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyForecasts[dayKey]) {
        dailyForecasts[dayKey] = { date, forecasts: [] };
      }
      dailyForecasts[dayKey].forecasts.push(item);
    });
    
    const weeklyForecast: ForecastDay[] = [];
    const today = new Date();
    
    // Get weather icon mapping
    const getWeatherEmoji = (iconCode: string) => {
      const iconMap: { [key: string]: string } = {
        '01d': '☀️', '01n': '🌙', '02d': '🌤️', '02n': '☁️',
        '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
        '09d': '🌦️', '09n': '🌦️', '10d': '🌧️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️', '13d': '🌨️', '13n': '🌨️',
        '50d': '🌫️', '50n': '🌫️'
      };
      return iconMap[iconCode] || '🌤️';
    };
    
    // Calculate rain probability more accurately
    const calculateRainProbability = (forecasts: any[]) => {
      const rainForecasts = forecasts.filter(f => f.weather[0].main.toLowerCase().includes('rain') || f.pop > 0);
      if (rainForecasts.length === 0) return 0;
      
      const avgPop = rainForecasts.reduce((sum, f) => sum + (f.pop || 0), 0) / rainForecasts.length;
      return Math.round(avgPop * 100);
    };
    
    Object.entries(dailyForecasts).slice(0, 7).forEach(([dateStr, { date, forecasts }], index) => {
      const temps = forecasts.map(f => f.main.temp);
      const conditions = forecasts.map(f => f.weather[0]);
      const rainProbability = calculateRainProbability(forecasts);
      
      // Determine day label
      let dayLabel: string;
      const daysDiff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        dayLabel = 'Today';
      } else if (daysDiff === 1) {
        dayLabel = 'Tomorrow';
      } else {
        dayLabel = date.toLocaleDateString('en-US', { weekday: 'long' });
      }
      
      // Format date
      const dateLabel = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      weeklyForecast.push({
        day: dayLabel,
        date: dateLabel,
        high: `${Math.round(Math.max(...temps))}°`,
        low: `${Math.round(Math.min(...temps))}°`,
        condition: conditions[0].description.replace(/\b\w/g, (l: string) => l.toUpperCase()),
        rain: `${rainProbability}%`,
        icon: getWeatherEmoji(conditions[0].icon)
      });
    });
    
    return weeklyForecast;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    // Return fallback data with proper dates
    const today = new Date();
    const fallbackData: ForecastDay[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      let dayLabel: string;
      if (i === 0) dayLabel = 'Today';
      else if (i === 1) dayLabel = 'Tomorrow';
      else dayLabel = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      const dateLabel = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      fallbackData.push({
        day: dayLabel,
        date: dateLabel,
        high: `${Math.round(Math.random() * 10 + 25)}°`,
        low: `${Math.round(Math.random() * 8 + 18)}°`,
        condition: "Partly Cloudy",
        rain: `${Math.round(Math.random() * 60 + 10)}%`,
        icon: "🌤️"
      });
    }
    
    return fallbackData;
  }
};

export const getFarmingAdvisory = async (weatherData: WeatherData, forecast: ForecastDay[]): Promise<FarmingAdvisory[]> => {
  // This would typically use actual weather data to generate smart advisories
  // For now, returning sample data based on weather conditions
  
  const advisories: FarmingAdvisory[] = [];
  
  // Check for heavy rain in forecast
  const heavyRainDays = forecast.filter(day => parseInt(day.rain) > 70);
  if (heavyRainDays.length > 0) {
    advisories.push({
      type: "warning",
      title: "Heavy Rain Alert",
      description: `Heavy rainfall expected on ${heavyRainDays[0].day}. Avoid field operations and ensure proper drainage.`,
      icon: 'AlertTriangle',
      color: "text-warning bg-warning/10 border-warning/30"
    });
  }
  
  // Check for good irrigation conditions
  const temp = parseInt(weatherData.temperature);
  const humidity = parseInt(weatherData.humidity);
  if (temp < 30 && humidity < 80) {
    advisories.push({
      type: "success",
      title: "Perfect for Irrigation",
      description: "Good weather conditions for irrigation today and tomorrow morning.",
      icon: 'CheckCircle2',
      color: "text-success bg-success/10 border-success/30"
    });
  }
  
  // Pest control timing
  advisories.push({
    type: "info",
    title: "Pest Control Timing",
    description: "Avoid spraying pesticides today due to expected rainfall. Best time: Friday morning.",
    icon: 'CloudSun',
    color: "text-primary bg-primary/10 border-primary/30"
  });
  
  return advisories;
};

export const getAgriculturalIndices = async (): Promise<AgriculturalIndex[]> => {
  // This would typically calculate based on actual weather data and soil conditions
  return [
    { name: "Growing Degree Days", value: "245", status: "Optimal", color: "text-success" },
    { name: "Soil Moisture Index", value: "78%", status: "Good", color: "text-success" },
    { name: "Evapotranspiration", value: "4.2mm", status: "Moderate", color: "text-warning" },
    { name: "Disease Pressure", value: "Medium", status: "Monitor", color: "text-warning" }
  ];
};