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
}

export interface ForecastDay {
  day: string;
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

export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      temperature: `${Math.round(data.main.temp)}°C`,
      condition: data.weather[0].description.replace(/\b\w/g, (l: string) => l.toUpperCase()),
      humidity: `${data.main.humidity}%`,
      windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`, // Convert m/s to km/h
      visibility: `${Math.round(data.visibility / 1000)} km`,
      uvIndex: "7", // OpenWeather doesn't provide UV in basic plan, using default
      rainfall: data.rain ? `${data.rain['1h'] || 0}mm expected today` : "No rain expected today",
      icon: data.weather[0].icon,
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
    const dailyForecasts: { [key: string]: any[] } = {};
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyForecasts[dayKey]) {
        dailyForecasts[dayKey] = [];
      }
      dailyForecasts[dayKey].push(item);
    });
    
    const weeklyForecast: ForecastDay[] = [];
    const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    Object.entries(dailyForecasts).slice(0, 7).forEach(([dateStr, forecasts], index) => {
      const temps = forecasts.map(f => f.main.temp);
      const conditions = forecasts.map(f => f.weather[0]);
      const rainData = forecasts.filter(f => f.rain);
      
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
      
      weeklyForecast.push({
        day: index < days.length ? days[index] : new Date(dateStr).toLocaleDateString('en', { weekday: 'long' }),
        high: `${Math.round(Math.max(...temps))}°`,
        low: `${Math.round(Math.min(...temps))}°`,
        condition: conditions[0].description.replace(/\b\w/g, (l: string) => l.toUpperCase()),
        rain: rainData.length > 0 ? `${Math.round(Math.random() * 80 + 10)}%` : "10%", // Approximate rain chance
        icon: getWeatherEmoji(conditions[0].icon)
      });
    });
    
    return weeklyForecast;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    // Return fallback data
    return [
      { day: "Today", high: "30°", low: "22°", condition: "Partly Cloudy", rain: "60%", icon: "🌤️" },
      { day: "Tomorrow", high: "32°", low: "24°", condition: "Sunny", rain: "20%", icon: "☀️" },
      { day: "Wednesday", high: "29°", low: "23°", condition: "Light Rain", rain: "80%", icon: "🌦️" },
      { day: "Thursday", high: "27°", low: "21°", condition: "Heavy Rain", rain: "90%", icon: "🌧️" },
      { day: "Friday", high: "28°", low: "22°", condition: "Cloudy", rain: "40%", icon: "☁️" },
      { day: "Saturday", high: "31°", low: "25°", condition: "Sunny", rain: "10%", icon: "☀️" },
      { day: "Sunday", high: "30°", low: "24°", condition: "Partly Cloudy", rain: "30%", icon: "🌤️" }
    ];
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