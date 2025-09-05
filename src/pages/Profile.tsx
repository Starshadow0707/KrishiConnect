import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Leaf,
  Settings,
  Bell,
  Globe,
  Save,
  Camera,
  Award,
  BarChart3
} from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 9876543210",
    district: "Palakkad",
    village: "Chittur",
    farmSize: "5 acres",
    soilType: "Red Laterite",
    crops: "Rice, Coconut, Pepper",
    language: "Malayalam",
    experience: "15 years",
    bio: "Experienced rice and spice farmer from Palakkad district. Always looking to learn new sustainable farming techniques."
  });

  const farmerStats = [
    { label: "Queries Asked", value: "127", icon: BarChart3, color: "text-primary" },
    { label: "Solutions Found", value: "119", icon: Award, color: "text-success" },
    { label: "Accuracy Rate", value: "94%", icon: Award, color: "text-success" },
    { label: "Experience", value: "15 years", icon: Leaf, color: "text-accent" }
  ];

  const recentActivity = [
    {
      action: "Asked about rice leaf curl treatment",
      timestamp: "2 hours ago",
      result: "Solution provided"
    },
    {
      action: "Checked weather forecast for irrigation",
      timestamp: "1 day ago",
      result: "Schedule updated"
    },
    {
      action: "Viewed market prices for pepper",
      timestamp: "2 days ago",
      result: "Price alert set"
    },
    {
      action: "Uploaded crop disease photo",
      timestamp: "3 days ago",
      result: "Disease identified"
    }
  ];

  const achievements = [
    { title: "Early Adopter", description: "Among first 1000 farmers to join KrishiConnect", icon: "🏆" },
    { title: "AI Expert", description: "Asked 100+ successful queries", icon: "🤖" },
    { title: "Community Helper", description: "Helped 5+ fellow farmers", icon: "🤝" },
    { title: "Smart Farmer", description: "Uses all platform features regularly", icon: "🌱" }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save profile data logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Farmer Profile</h1>
          <p className="text-muted-foreground">Manage your account and farming preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="agricultural-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
                <Button
                  variant={isEditing ? "success" : "outline"}
                  size="sm"
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Picture */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profileData.name}</h3>
                    <p className="text-muted-foreground">Kerala Farmer</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={profileData.district}
                      onChange={(e) => setProfileData({...profileData, district: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village">Village/Town</Label>
                    <Input
                      id="village"
                      value={profileData.village}
                      onChange={(e) => setProfileData({...profileData, village: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <select
                      id="language"
                      value={profileData.language}
                      onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background"
                    >
                      <option value="Malayalam">മലയാളം (Malayalam)</option>
                      <option value="English">English</option>
                      <option value="Tamil">தமிழ் (Tamil)</option>
                      <option value="Telugu">తెలుగు (Telugu)</option>
                      <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About Your Farm</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Farm Details */}
            <Card className="agricultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-success" />
                  Farm Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size</Label>
                    <Input
                      id="farmSize"
                      value={profileData.farmSize}
                      onChange={(e) => setProfileData({...profileData, farmSize: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Input
                      id="soilType"
                      value={profileData.soilType}
                      onChange={(e) => setProfileData({...profileData, soilType: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crops">Crops Grown</Label>
                    <Input
                      id="crops"
                      value={profileData.crops}
                      onChange={(e) => setProfileData({...profileData, crops: e.target.value})}
                      disabled={!isEditing}
                      placeholder="e.g., Rice, Coconut, Pepper"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Farming Experience</Label>
                    <Input
                      id="experience"
                      value={profileData.experience}
                      onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="agricultural-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                          <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                            {activity.result}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="agricultural-card">
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmerStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${stat.color}`} />
                          <span className="text-sm">{stat.label}</span>
                        </div>
                        <span className="font-semibold">{stat.value}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="agricultural-card">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-success/5">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="agricultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/settings">
                      <Bell className="h-4 w-4 mr-2" />
                      Notification Settings
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/disease-detection">
                      <Camera className="h-4 w-4 mr-2" />
                      Disease Detection
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/weather">
                      <Globe className="h-4 w-4 mr-2" />
                      Weather Forecast
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;