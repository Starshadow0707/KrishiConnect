import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown, 
  Search,
  MapPin,
  Calendar,
  Bell,
  BarChart3,
  Filter
} from "lucide-react";
import { useState } from "react";

const Market = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const marketData = [
    {
      crop: "Rice (Raw)",
      variety: "Jyothi",
      price: 2850,
      unit: "quintal",
      change: 8.2,
      market: "Palakkad Mandi",
      lastUpdated: "2 hours ago",
      category: "cereals"
    },
    {
      crop: "Coconut",
      variety: "Tender",
      price: 12.5,
      unit: "piece",
      change: 2.1,
      market: "Thrissur Market",
      lastUpdated: "1 hour ago",
      category: "plantation"
    },
    {
      crop: "Black Pepper",
      variety: "Panniyur 1",
      price: 485,
      unit: "kg",
      change: -3.2,
      market: "Kochi Spice Board",
      lastUpdated: "30 min ago",
      category: "spices"
    },
    {
      crop: "Cardamom",
      variety: "Small",
      price: 1485,
      unit: "kg",
      change: 12.8,
      market: "Kumily Market",
      lastUpdated: "1 hour ago",
      category: "spices"
    },
    {
      crop: "Rubber",
      variety: "RSS-4",
      price: 168,
      unit: "kg",
      change: 5.4,
      market: "Kottayam Market",
      lastUpdated: "45 min ago",
      category: "plantation"
    },
    {
      crop: "Banana",
      variety: "Nendran",
      price: 45,
      unit: "dozen",
      change: -1.8,
      market: "Thrissur Market",
      lastUpdated: "2 hours ago",
      category: "fruits"
    },
    {
      crop: "Turmeric",
      variety: "Alleppey",
      price: 125,
      unit: "kg",
      change: 7.3,
      market: "Ernakulam Market",
      lastUpdated: "1.5 hours ago",
      category: "spices"
    },
    {
      crop: "Ginger",
      variety: "Wayanad",
      price: 85,
      unit: "kg",
      change: -2.5,
      market: "Wayanad Market",
      lastUpdated: "3 hours ago",
      category: "spices"
    }
  ];

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "cereals", name: "Cereals" },
    { id: "spices", name: "Spices" },
    { id: "plantation", name: "Plantation Crops" },
    { id: "fruits", name: "Fruits" },
    { id: "vegetables", name: "Vegetables" }
  ];

  const topMovers = [
    { crop: "Cardamom", change: 12.8, price: "₹1,485/kg" },
    { crop: "Rice", change: 8.2, price: "₹2,850/quintal" },
    { crop: "Turmeric", change: 7.3, price: "₹125/kg" },
    { crop: "Rubber", change: 5.4, price: "₹168/kg" }
  ];

  const marketNews = [
    {
      title: "Cardamom prices surge due to reduced supply",
      time: "2 hours ago",
      impact: "positive"
    },
    {
      title: "Good monsoon boosts rice production expectations",
      time: "5 hours ago",
      impact: "neutral"
    },
    {
      title: "Export demand drives pepper prices higher",
      time: "1 day ago",
      impact: "positive"
    }
  ];

  const filteredData = marketData.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.variety.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Market Prices</h1>
          <p className="text-muted-foreground">Live commodity prices from Kerala markets</p>
        </div>

        {/* Search and Filters */}
        <Card className="agricultural-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search crops, varieties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Price Table */}
          <div className="lg:col-span-3">
            <Card className="agricultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Current Market Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="space-y-3">
                    {filteredData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-semibold">{item.crop}</h3>
                              <p className="text-sm text-muted-foreground">{item.variety}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{item.market}</span>
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            <span>{item.lastUpdated}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ₹{item.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">per {item.unit}</div>
                          <div className={`flex items-center gap-1 text-sm font-medium mt-1 ${
                            item.change > 0 
                              ? 'text-success' 
                              : item.change < 0 
                                ? 'text-destructive' 
                                : 'text-muted-foreground'
                          }`}>
                            {item.change > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : item.change < 0 ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : null}
                            {Math.abs(item.change)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Movers */}
            <Card className="agricultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Top Movers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topMovers.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-success/5">
                      <div>
                        <div className="font-medium">{item.crop}</div>
                        <div className="text-sm text-muted-foreground">{item.price}</div>
                      </div>
                      <div className="text-success font-medium">
                        +{item.change}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market News */}
            <Card className="agricultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-warning" />
                  Market News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketNews.map((news, index) => (
                    <div key={index} className="p-3 rounded-lg border-l-4 border-l-primary bg-primary/5">
                      <h4 className="font-medium text-sm mb-1">{news.title}</h4>
                      <p className="text-xs text-muted-foreground">{news.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Alerts */}
            <Card className="agricultural-card">
              <CardContent className="p-6 text-center">
                <Bell className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Price Alerts</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get notified when your crops hit target prices
                </p>
                <Button variant="default" size="sm" className="w-full">
                  Set Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Need Market Analysis?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              Ask AI for Market Insights
            </Button>
            <Button variant="outline" size="lg">
              View Price History
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Market;