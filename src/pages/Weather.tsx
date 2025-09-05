// import { useEffect, useState } from "react";
// import Header from "@/components/Header";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   CloudSun, 
//   Droplets, 
//   Wind, 
//   Thermometer,
//   Eye,
//   ArrowUp,
//   AlertTriangle,
//   CheckCircle2
// } from "lucide-react";
// import weatherIllustration from "@/assets/weather-illustration.png";
// import { getCurrentWeather, getForecast, WeatherData } from "@/services/weather_service";

// const Weather = () => {
//   // const currentWeather = {
//   //   temperature: "28°C",
//   //   condition: "Partly Cloudy",
//   //   humidity: "75%",
//   //   windSpeed: "12 km/h",
//   //   visibility: "8 km",
//   //   uvIndex: "7",
//   //   rainfall: "5mm expected today"
//   // };

//   const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
//   const [location, setLocation] = useState({ lat: 0, lon: 0 });
//   const [loading, setLoading] = useState(true);

//   // const weeklyForecast = [
//   //   { day: "Today", high: "30°", low: "22°", condition: "Partly Cloudy", rain: "60%", icon: "🌤️" },
//   //   { day: "Tomorrow", high: "32°", low: "24°", condition: "Sunny", rain: "20%", icon: "☀️" },
//   //   { day: "Wednesday", high: "29°", low: "23°", condition: "Light Rain", rain: "80%", icon: "🌦️" },
//   //   { day: "Thursday", high: "27°", low: "21°", condition: "Heavy Rain", rain: "90%", icon: "🌧️" },
//   //   { day: "Friday", high: "28°", low: "22°", condition: "Cloudy", rain: "40%", icon: "☁️" },
//   //   { day: "Saturday", high: "31°", low: "25°", condition: "Sunny", rain: "10%", icon: "☀️" },
//   //   { day: "Sunday", high: "30°", low: "24°", condition: "Partly Cloudy", rain: "30%", icon: "🌤️" }
//   // ];

//   // const farmingAdvisory = [
//   //   {
//   //     type: "warning",
//   //     title: "Heavy Rain Alert",
//   //     description: "Heavy rainfall expected on Thursday. Avoid field operations and ensure proper drainage.",
//   //     icon: AlertTriangle,
//   //     color: "text-warning bg-warning/10 border-warning/30"
//   //   },
//   //   {
//   //     type: "success",
//   //     title: "Perfect for Irrigation",
//   //     description: "Good weather conditions for irrigation today and tomorrow morning.",
//   //     icon: CheckCircle2,
//   //     color: "text-success bg-success/10 border-success/30"
//   //   },
//   //   {
//   //     type: "info",
//   //     title: "Pest Control Timing",
//   //     description: "Avoid spraying pesticides today due to expected rainfall. Best time: Friday morning.",
//   //     icon: CloudSun,
//   //     color: "text-primary bg-primary/10 border-primary/30"
//   //   }
//   // ];

//   // const agriculturalIndices = [
//   //   { name: "Growing Degree Days", value: "245", status: "Optimal", color: "text-success" },
//   //   { name: "Soil Moisture Index", value: "78%", status: "Good", color: "text-success" },
//   //   { name: "Evapotranspiration", value: "4.2mm", status: "Moderate", color: "text-warning" },
//   //   { name: "Disease Pressure", value: "Medium", status: "Monitor", color: "text-warning" }
//   // ];

//   useEffect(() => {
//   navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         setLocation({ lat: latitude, lon: longitude });
        
//         try {
//           const weather = await getCurrentWeather(latitude, longitude);
//           setCurrentWeather(weather);
//         } catch (error) {
//           console.error("Error fetching weather:", error);
//         } finally {
//           setLoading(false);
//         }
//       },
//       (error) => {
//         console.error("Error getting location:", error);
//         setLoading(false);
//       }
//     );
//   }, []);

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
      
//       <main className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gradient mb-2">Weather Forecast</h1>
//           <p className="text-muted-foreground">Agricultural weather insights for your region</p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Current Weather */}
//           <Card className="agricultural-card lg:col-span-1">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CloudSun className="h-5 w-5 text-primary" />
//                 Current Weather
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-center mb-6">
//                 <img 
//                   src={weatherIllustration} 
//                   alt="Current Weather" 
//                   className="w-24 h-24 mx-auto mb-4"
//                 />
//                 <div className="text-4xl font-bold mb-1">{currentWeather.temperature}</div>
//                 <div className="text-muted-foreground text-lg">{currentWeather.condition}</div>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Droplets className="h-4 w-4 text-blue-500" />
//                     <span className="text-sm">Humidity</span>
//                   </div>
//                   <span className="font-medium">{currentWeather.humidity}</span>
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Wind className="h-4 w-4 text-gray-500" />
//                     <span className="text-sm">Wind Speed</span>
//                   </div>
//                   <span className="font-medium">{currentWeather.windSpeed}</span>
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Eye className="h-4 w-4 text-purple-500" />
//                     <span className="text-sm">Visibility</span>
//                   </div>
//                   <span className="font-medium">{currentWeather.visibility}</span>
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Thermometer className="h-4 w-4 text-red-500" />
//                     <span className="text-sm">UV Index</span>
//                   </div>
//                   <span className="font-medium">{currentWeather.uvIndex}</span>
//                 </div>
//               </div>

//               <div className="mt-6 p-3 bg-primary/10 rounded-lg">
//                 <p className="text-sm text-primary font-medium">🌧️ Today's Rainfall:</p>
//                 <p className="text-sm">{currentWeather.rainfall}</p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* 7-Day Forecast */}
//           <Card className="agricultural-card lg:col-span-2">
//             <CardHeader>
//               <CardTitle>7-Day Forecast</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid gap-3">
//                 {weeklyForecast.map((forecast, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
//                   >
//                     <div className="flex items-center gap-4">
//                       <span className="text-2xl">{forecast.icon}</span>
//                       <div>
//                         <div className="font-medium">{forecast.day}</div>
//                         <div className="text-sm text-muted-foreground">{forecast.condition}</div>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-6">
//                       <div className="text-center">
//                         <div className="text-sm text-muted-foreground">Rain</div>
//                         <div className="font-medium text-blue-600">{forecast.rain}</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-sm text-muted-foreground">High/Low</div>
//                         <div className="font-medium">
//                           <span className="text-red-500">{forecast.high}</span>
//                           <span className="text-muted-foreground mx-1">/</span>
//                           <span className="text-blue-500">{forecast.low}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Agricultural Advisory */}
//         <Card className="agricultural-card mt-6">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-warning" />
//               Farming Advisory
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid md:grid-cols-3 gap-4">
//               {farmingAdvisory.map((advisory, index) => {
//                 const Icon = advisory.icon;
//                 return (
//                   <div
//                     key={index}
//                     className={`p-4 rounded-lg border ${advisory.color}`}
//                   >
//                     <div className="flex items-start gap-3">
//                       <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <h4 className="font-medium mb-1">{advisory.title}</h4>
//                         <p className="text-sm opacity-80">{advisory.description}</p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Agricultural Indices */}
//         <Card className="agricultural-card mt-6">
//           <CardHeader>
//             <CardTitle>Agricultural Indices</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid md:grid-cols-4 gap-6">
//               {agriculturalIndices.map((index, idx) => (
//                 <div key={idx} className="text-center">
//                   <div className="text-2xl font-bold mb-1">{index.value}</div>
//                   <div className="text-sm font-medium mb-1">{index.name}</div>
//                   <div className={`text-xs px-2 py-1 rounded-full ${index.color} bg-current/10`}>
//                     {index.status}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Quick Actions */}
//         <div className="mt-8 text-center">
//           <h3 className="text-lg font-semibold mb-4">Need Weather-Based Farming Advice?</h3>
//           <Button variant="hero" size="lg" className="mr-4">
//             Ask AI Assistant
//           </Button>
//           <Button variant="outline" size="lg">
//             Set Weather Alerts
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Weather;

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer,
  Eye,
  ArrowUp,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import weatherIllustration from "@/assets/weather-illustration.png";
import { 
  getCurrentWeather, 
  getForecast, 
  getFarmingAdvisory,
  getAgriculturalIndices,
  WeatherData,
  ForecastDay,
  FarmingAdvisory,
  AgriculturalIndex
} from "@/services/weather_service";

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [weeklyForecast, setWeeklyForecast] = useState<ForecastDay[]>([]);
  const [farmingAdvisory, setFarmingAdvisory] = useState<FarmingAdvisory[]>([]);
  const [agriculturalIndices, setAgriculturalIndices] = useState<AgriculturalIndex[]>([]);
  const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        
        try {
          // Fetch all weather data
          const weather = await getCurrentWeather(latitude, longitude);
          const forecast = await getForecast(latitude, longitude);
          const advisory = await getFarmingAdvisory(weather, forecast);
          const indices = await getAgriculturalIndices();
          
          setCurrentWeather(weather);
          setWeeklyForecast(forecast);
          setFarmingAdvisory(advisory);
          setAgriculturalIndices(indices);
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setError("Failed to fetch weather data. Please check your internet connection and try again.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("Unable to get your location. Please enable location services and try again.");
        setLoading(false);
      }
    );
  }, []);

  // Icon mapping for farming advisory
  const getAdvisoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle':
        return AlertTriangle;
      case 'CheckCircle2':
        return CheckCircle2;
      case 'CloudSun':
        return CloudSun;
      default:
        return AlertTriangle;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading weather data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Weather Data Unavailable</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
      </div>
    );
  }

  if (!currentWeather) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Weather Forecast</h1>
          <p className="text-muted-foreground">Agricultural weather insights for your region</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Weather */}
          <Card className="agricultural-card lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-primary" />
                Current Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <img 
                  src={weatherIllustration} 
                  alt="Current Weather" 
                  className="w-24 h-24 mx-auto mb-4"
                />
                <div className="text-4xl font-bold mb-1">{currentWeather.temperature}</div>
                <div className="text-muted-foreground text-lg">{currentWeather.condition}</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <span className="font-medium">{currentWeather.humidity}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Wind Speed</span>
                  </div>
                  <span className="font-medium">{currentWeather.windSpeed}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Visibility</span>
                  </div>
                  <span className="font-medium">{currentWeather.visibility}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span className="text-sm">UV Index</span>
                  </div>
                  <span className="font-medium">{currentWeather.uvIndex}</span>
                </div>
              </div>

              <div className="mt-6 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">🌧️ Today's Rainfall:</p>
                <p className="text-sm">{currentWeather.rainfall}</p>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card className="agricultural-card lg:col-span-2">
            <CardHeader>
              <CardTitle>7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {weeklyForecast.map((forecast, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{forecast.icon}</span>
                      <div>
                        <div className="font-medium">{forecast.day}</div>
                        <div className="text-sm text-muted-foreground">{forecast.condition}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Rain</div>
                        <div className="font-medium text-blue-600">{forecast.rain}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">High/Low</div>
                        <div className="font-medium">
                          <span className="text-red-500">{forecast.high}</span>
                          <span className="text-muted-foreground mx-1">/</span>
                          <span className="text-blue-500">{forecast.low}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agricultural Advisory */}
        <Card className="agricultural-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Farming Advisory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {farmingAdvisory.map((advisory, index) => {
                const Icon = getAdvisoryIcon(advisory.icon);
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${advisory.color}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">{advisory.title}</h4>
                        <p className="text-sm opacity-80">{advisory.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Agricultural Indices */}
        <Card className="agricultural-card mt-6">
          <CardHeader>
            <CardTitle>Agricultural Indices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {agriculturalIndices.map((index, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-bold mb-1">{index.value}</div>
                  <div className="text-sm font-medium mb-1">{index.name}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${index.color} bg-current/10`}>
                    {index.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Need Weather-Based Farming Advice?</h3>
          <Button variant="hero" size="lg" className="mr-4">
            Ask AI Assistant
          </Button>
          <Button variant="outline" size="lg">
            Set Weather Alerts
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Weather;