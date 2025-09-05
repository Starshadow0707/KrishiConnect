import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Volume2, 
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
  Leaf,
  Save,
  CheckCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    weatherAlerts: true,
    marketUpdates: true,
    diseaseAlerts: true,
    chatMessages: true,
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: 'en',
    autoSpeak: true,
    location: 'Kerala, India'
  });

  const [privacy, setPrivacy] = useState({
    shareLocation: true,
    shareUsageData: false,
    personalizedAds: false
  });

  const [saved, setSaved] = useState(false);

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Here you would typically save to backend/localStorage
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <SettingsIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Customize your KrishiConnect experience</p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Content Notifications</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Weather Alerts</span>
                      </div>
                      <Button
                        variant={notifications.weatherAlerts ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('weatherAlerts', !notifications.weatherAlerts)}
                      >
                        {notifications.weatherAlerts ? 'On' : 'Off'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Market Updates</span>
                      </div>
                      <Button
                        variant={notifications.marketUpdates ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('marketUpdates', !notifications.marketUpdates)}
                      >
                        {notifications.marketUpdates ? 'On' : 'Off'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Disease Alerts</span>
                      </div>
                      <Button
                        variant={notifications.diseaseAlerts ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('diseaseAlerts', !notifications.diseaseAlerts)}
                      >
                        {notifications.diseaseAlerts ? 'On' : 'Off'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Chat Messages</span>
                      </div>
                      <Button
                        variant={notifications.chatMessages ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('chatMessages', !notifications.chatMessages)}
                      >
                        {notifications.chatMessages ? 'On' : 'Off'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Delivery Methods</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Email Notifications</span>
                      </div>
                      <Button
                        variant={notifications.emailNotifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('emailNotifications', !notifications.emailNotifications)}
                      >
                        {notifications.emailNotifications ? 'On' : 'Off'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Push Notifications</span>
                      </div>
                      <Button
                        variant={notifications.pushNotifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('pushNotifications', !notifications.pushNotifications)}
                      >
                        {notifications.pushNotifications ? 'On' : 'Off'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {notifications.soundEnabled ? 
                          <Volume2 className="h-4 w-4 text-orange-600" /> : 
                          <VolumeX className="h-4 w-4 text-gray-400" />
                        }
                        <span className="text-sm">Sound Notifications</span>
                      </div>
                      <Button
                        variant={notifications.soundEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('soundEnabled', !notifications.soundEnabled)}
                      >
                        {notifications.soundEnabled ? 'On' : 'Off'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* App Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-blue-600" />
                  App Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {preferences.darkMode ? 
                          <Moon className="h-4 w-4 text-blue-600" /> : 
                          <Sun className="h-4 w-4 text-yellow-600" />
                        }
                        <span className="text-sm">Dark Mode</span>
                      </div>
                      <Button
                        variant={preferences.darkMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreferenceChange('darkMode', !preferences.darkMode)}
                      >
                        {preferences.darkMode ? 'On' : 'Off'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Auto-speak AI responses</span>
                      </div>
                      <Button
                        variant={preferences.autoSpeak ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreferenceChange('autoSpeak', !preferences.autoSpeak)}
                      >
                        {preferences.autoSpeak ? 'On' : 'Off'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => handlePreferenceChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Default Location</label>
                      <input
                        type="text"
                        value={preferences.location}
                        onChange={(e) => handlePreferenceChange('location', e.target.value)}
                        placeholder="e.g., Kerala, India"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Privacy & Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Share Location Data</span>
                    <p className="text-xs text-muted-foreground">Allow app to use your location for weather and local recommendations</p>
                  </div>
                  <Button
                    variant={privacy.shareLocation ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePrivacyChange('shareLocation', !privacy.shareLocation)}
                  >
                    {privacy.shareLocation ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Share Usage Data</span>
                    <p className="text-xs text-muted-foreground">Help improve the app by sharing anonymous usage statistics</p>
                  </div>
                  <Button
                    variant={privacy.shareUsageData ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePrivacyChange('shareUsageData', !privacy.shareUsageData)}
                  >
                    {privacy.shareUsageData ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Personalized Ads</span>
                    <p className="text-xs text-muted-foreground">Show ads based on your interests and app usage</p>
                  </div>
                  <Button
                    variant={privacy.personalizedAds ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePrivacyChange('personalizedAds', !privacy.personalizedAds)}
                  >
                    {privacy.personalizedAds ? 'On' : 'Off'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveSettings}
                size="lg"
                className="flex items-center gap-2"
                disabled={saved}
              >
                {saved ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Settings Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
