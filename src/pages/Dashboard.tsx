import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardStats from "@/components/DashboardStats";
import { 
  CloudSun, 
  TrendingUp, 
  MessageCircle,
  Calendar,
  Bell,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import weatherIllustration from "@/assets/weather-illustration.png";

const Dashboard = () => {
  const weatherData = {
    current: {
      temperature: "28°C",
      condition: "Partly Cloudy",
      humidity: "75%",
      rainfall: "5mm expected"
    },
    advisory: "Good day for irrigation. Avoid pesticide spraying due to expected rainfall."
  };

  const marketHighlights = [
    { crop: "Rice", price: "₹2,850/quintal", change: "+8%" },
    { crop: "Coconut", price: "₹12,500/1000 nuts", change: "+2%" },
    { crop: "Pepper", price: "₹485/kg", change: "-3%" },
    { crop: "Cardamom", price: "₹1,485/kg", change: "+12%" }
  ];

  const cropCalendar = [
    { activity: "Paddy Sowing", date: "Next 2 weeks", status: "upcoming" },
    { activity: "Coconut Harvesting", date: "This week", status: "current" },
    { activity: "Spice Pruning", date: "Completed", status: "done" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening on your farm today.</p>
          </div>
          <div className="flex gap-2 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Stats */}
        <DashboardStats />

        {/* Dashboard Widgets */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Weather Widget */}
          <Card className="agricultural-card lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-primary" />
                Today's Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <img 
                  src={weatherIllustration} 
                  alt="Weather" 
                  className="w-20 h-20 mx-auto mb-3"
                />
                <div className="text-3xl font-bold">{weatherData.current.temperature}</div>
                <div className="text-muted-foreground">{weatherData.current.condition}</div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm">Humidity</span>
                  <span className="text-sm font-medium">{weatherData.current.humidity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Expected Rain</span>
                  <span className="text-sm font-medium">{weatherData.current.rainfall}</span>
                </div>
              </div>

              <div className="p-3 bg-primary/5 rounded-lg mb-4">
                <p className="text-sm text-primary font-medium">📋 Advisory:</p>
                <p className="text-sm mt-1">{weatherData.advisory}</p>
              </div>

              <Link to="/weather">
                <Button className="w-full" variant="outline">
                  7-Day Forecast
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Market Prices Widget */}
          <Card className="agricultural-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Market Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketHighlights.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium">{item.crop}</div>
                      <div className="text-sm text-muted-foreground">{item.price}</div>
                    </div>
                    <div className={`text-sm font-medium px-2 py-1 rounded ${
                      item.change.startsWith('+') 
                        ? 'text-success bg-success/10' 
                        : 'text-destructive bg-destructive/10'
                    }`}>
                      {item.change}
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/market">
                <Button className="w-full mt-4" variant="outline">
                  View All Prices
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Crop Calendar Widget */}
          <Card className="agricultural-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Crop Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cropCalendar.map((item, index) => {
                  const statusColors = {
                    upcoming: "bg-warning/10 text-warning border-l-warning",
                    current: "bg-primary/10 text-primary border-l-primary",
                    done: "bg-success/10 text-success border-l-success"
                  };
                  
                  return (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border-l-4 ${statusColors[item.status as keyof typeof statusColors]}`}
                    >
                      <div className="font-medium">{item.activity}</div>
                      <div className="text-sm opacity-80">{item.date}</div>
                    </div>
                  );
                })}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Full Calendar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Chat Access */}
        <Card className="agricultural-card mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Need Farming Advice?</h3>
              <p className="text-muted-foreground mb-4">
                Ask our AI assistant anything about crops, diseases, weather, or market prices
              </p>
              <Link to="/chat">
                <Button variant="hero" size="lg">
                  Start AI Chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;