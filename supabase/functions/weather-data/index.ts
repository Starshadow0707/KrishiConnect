import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');

// Kerala district coordinates for weather data
const keralaCities = {
  'Thiruvananthapuram': { lat: 8.5241, lon: 76.9366 },
  'Kollam': { lat: 8.8932, lon: 76.6141 },
  'Pathanamthitta': { lat: 9.2648, lon: 76.7869 },
  'Alappuzha': { lat: 9.4981, lon: 76.3388 },
  'Kottayam': { lat: 9.5916, lon: 76.5222 },
  'Idukki': { lat: 9.8467, lon: 76.9739 },
  'Ernakulam': { lat: 9.9312, lon: 76.2673 },
  'Thrissur': { lat: 10.5276, lon: 76.2144 },
  'Palakkad': { lat: 10.7867, lon: 76.6548 },
  'Malappuram': { lat: 11.0410, lon: 76.0760 },
  'Kozhikode': { lat: 11.2588, lon: 75.7804 },
  'Wayanad': { lat: 11.6854, lon: 76.1320 },
  'Kannur': { lat: 11.8745, lon: 75.3704 },
  'Kasaragod': { lat: 12.4996, lon: 74.9869 }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { district } = await req.json();
    
    if (!district) {
      throw new Error('District is required');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('Fetching weather data for district:', district);

    // Check if we have cached weather data that's still valid
    const { data: cachedWeather } = await supabase
      .from('weather_data')
      .select('*')
      .eq('district', district)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (cachedWeather) {
      console.log('Returning cached weather data for', district);
      return new Response(
        JSON.stringify({
          weather: cachedWeather.weather_data,
          agricultural: cachedWeather.agricultural_indices,
          forecast: cachedWeather.forecast_data,
          cached: true,
          lastUpdated: cachedWeather.cached_at
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get coordinates for the district
    const coordinates = keralaCities[district as keyof typeof keralaCities];
    if (!coordinates) {
      throw new Error(`Coordinates not found for district: ${district}`);
    }

    // Fetch current weather and 7-day forecast from OpenWeather
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${openWeatherApiKey}&units=metric`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${openWeatherApiKey}&units=metric&cnt=40`
      )
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data from OpenWeather API');
    }

    const currentWeather = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    // Calculate agricultural indices
    const agriculturalIndices = calculateAgriculturalIndices(currentWeather, forecastData);

    // Process forecast for next 7 days
    const processedForecast = processForecastData(forecastData);

    const weatherDataToCache = {
      district,
      weather_data: {
        temperature: currentWeather.main.temp,
        humidity: currentWeather.main.humidity,
        pressure: currentWeather.main.pressure,
        windSpeed: currentWeather.wind.speed,
        windDirection: currentWeather.wind.deg,
        visibility: currentWeather.visibility,
        cloudCover: currentWeather.clouds.all,
        description: currentWeather.weather[0].description,
        icon: currentWeather.weather[0].icon,
        feelsLike: currentWeather.main.feels_like,
        uvIndex: currentWeather.uvi || 0,
        sunrise: new Date(currentWeather.sys.sunrise * 1000),
        sunset: new Date(currentWeather.sys.sunset * 1000)
      },
      agricultural_indices: agriculturalIndices,
      forecast_data: processedForecast,
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() // 3 hours
    };

    // Cache the weather data
    await supabase
      .from('weather_data')
      .upsert(weatherDataToCache, { onConflict: 'district' });

    console.log('Weather data cached successfully for', district);

    return new Response(
      JSON.stringify({
        weather: weatherDataToCache.weather_data,
        agricultural: weatherDataToCache.agricultural_indices,
        forecast: weatherDataToCache.forecast_data,
        cached: false,
        lastUpdated: weatherDataToCache.cached_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in weather-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch weather data',
        details: 'Please check your network connection and try again.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function calculateAgriculturalIndices(current: any, forecast: any) {
  const temp = current.main.temp;
  const humidity = current.main.humidity;
  const windSpeed = current.wind.speed;

  // Calculate agricultural-specific indices
  const heatIndex = calculateHeatIndex(temp, humidity);
  const irrigationNeed = calculateIrrigationNeed(temp, humidity, windSpeed);
  const diseaseRisk = calculateDiseaseRisk(temp, humidity, forecast);
  const pestRisk = calculatePestRisk(temp, humidity);

  return {
    heatIndex: heatIndex,
    irrigationNeed: irrigationNeed,
    diseaseRisk: diseaseRisk,
    pestRisk: pestRisk,
    recommendations: generateRecommendations(temp, humidity, heatIndex, irrigationNeed, diseaseRisk)
  };
}

function calculateHeatIndex(temp: number, humidity: number): { value: number; status: string } {
  // Simplified heat index calculation
  const hi = temp + (humidity / 100) * (temp - 14.4);
  let status = 'Normal';
  
  if (hi > 40) status = 'Extreme Heat';
  else if (hi > 35) status = 'High Heat';
  else if (hi > 30) status = 'Moderate Heat';
  
  return { value: Math.round(hi), status };
}

function calculateIrrigationNeed(temp: number, humidity: number, windSpeed: number): { level: string; recommendation: string } {
  // Calculate evapotranspiration estimate
  const et = (temp * 0.46) + (windSpeed * 0.27) - (humidity * 0.05);
  
  let level = 'Low';
  let recommendation = 'Monitor soil moisture';
  
  if (et > 8) {
    level = 'High';
    recommendation = 'Irrigate crops immediately, especially leafy vegetables';
  } else if (et > 5) {
    level = 'Medium';
    recommendation = 'Plan irrigation for next 24 hours';
  }
  
  return { level, recommendation };
}

function calculateDiseaseRisk(temp: number, humidity: number, forecast: any): { level: string; diseases: string[]; prevention: string } {
  let riskLevel = 'Low';
  const diseases: string[] = [];
  let prevention = 'Regular monitoring recommended';
  
  // High humidity and moderate temps increase fungal disease risk
  if (humidity > 80 && temp > 20 && temp < 35) {
    riskLevel = 'High';
    diseases.push('Fungal infections', 'Leaf blight', 'Powdery mildew');
    prevention = 'Apply preventive fungicide, ensure good air circulation';
  } else if (humidity > 70) {
    riskLevel = 'Medium';
    diseases.push('Bacterial infections');
    prevention = 'Monitor for early symptoms, avoid overhead watering';
  }
  
  return { level: riskLevel, diseases, prevention };
}

function calculatePestRisk(temp: number, humidity: number): { level: string; pests: string[]; control: string } {
  let riskLevel = 'Low';
  const pests: string[] = [];
  let control = 'Regular inspection recommended';
  
  if (temp > 25 && temp < 35 && humidity > 60) {
    riskLevel = 'High';
    pests.push('Aphids', 'Whiteflies', 'Thrips');
    control = 'Apply integrated pest management, use yellow sticky traps';
  } else if (temp > 30) {
    riskLevel = 'Medium';
    pests.push('Mites', 'Caterpillars');
    control = 'Monitor closely, consider biological control methods';
  }
  
  return { level: riskLevel, pests, control };
}

function generateRecommendations(temp: number, humidity: number, heatIndex: any, irrigation: any, disease: any): string[] {
  const recommendations: string[] = [];
  
  if (heatIndex.status === 'Extreme Heat') {
    recommendations.push('Avoid field work during peak hours (10 AM - 4 PM)');
    recommendations.push('Increase shade for livestock and crops');
  }
  
  if (irrigation.level === 'High') {
    recommendations.push('Ensure adequate water supply for next 2-3 days');
  }
  
  if (disease.level === 'High') {
    recommendations.push('Check crops for early disease symptoms');
  }
  
  if (temp < 15) {
    recommendations.push('Protect sensitive crops from cold stress');
  }
  
  if (humidity > 90) {
    recommendations.push('Improve ventilation in greenhouse crops');
  }
  
  return recommendations;
}

function processForecastData(forecast: any) {
  const daily = new Map();
  
  forecast.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toDateString();
    
    if (!daily.has(date)) {
      daily.set(date, {
        date: date,
        temps: [],
        humidity: [],
        precipitation: 0,
        weather: item.weather[0].description,
        icon: item.weather[0].icon
      });
    }
    
    const dayData = daily.get(date);
    dayData.temps.push(item.main.temp);
    dayData.humidity.push(item.main.humidity);
    
    if (item.rain && item.rain['3h']) {
      dayData.precipitation += item.rain['3h'];
    }
  });
  
  return Array.from(daily.values()).map(day => ({
    date: day.date,
    maxTemp: Math.max(...day.temps),
    minTemp: Math.min(...day.temps),
    avgHumidity: Math.round(day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length),
    precipitation: Math.round(day.precipitation * 10) / 10,
    weather: day.weather,
    icon: day.icon
  })).slice(0, 7);
}