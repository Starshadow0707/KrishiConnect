import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Home, 
  CloudSun, 
  TrendingUp, 
  User, 
  Menu, 
  X,
  Leaf,
  Bell,
  Settings,
  Camera,
  Edit,
  LogOut,
  ChevronDown
} from "lucide-react";
import krishiLogo from "@/assets/krishi-logo.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "AI Chat", href: "/chat", icon: MessageCircle },
    { name: "Weather", href: "/weather", icon: CloudSun },
    { name: "Market", href: "/market", icon: TrendingUp },
    { name: "Disease Detection", href: "/disease-detection", icon: Camera },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src={krishiLogo} 
                alt="KrishiConnect Logo" 
                className="h-10 w-10 rounded-lg transition-transform group-hover:scale-105"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold group-hover:text-primary transition-colors">
                <span className="text-green-600">Krishi</span><span className="text-orange-500">Connect</span>
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI Farmer Advisory</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector */}
            <select className="px-3 py-2 rounded-lg border border-border bg-background text-sm hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="en">🇬🇧 English</option>
              <option value="ml">🇮🇳 മലയാളം</option>
              <option value="ta">🇮🇳 தமിழ്</option>
              <option value="te">🇮🇳 తెలుగు</option>
              <option value="kn">🇮🇳 ಕನ್ನಡ</option>
              <option value="hi">🇮🇳 हिन्दी</option>
            </select>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <User className="h-5 w-5 text-primary" />
                <ChevronDown className={`h-3 w-3 absolute bottom-0 right-0 text-muted-foreground transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium">John Farmer</p>
                    <p className="text-xs text-muted-foreground">john.farmer@example.com</p>
                  </div>
                  
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Link>
                  
                  <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  
                  <div className="border-t border-border mt-2 pt-2">
                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 w-full text-left transition-colors">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-up">
            <nav className="grid grid-cols-2 gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "outline"}
                      size="lg"
                      className="w-full flex items-center gap-3 justify-start"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile Actions */}
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <Link to="/profile" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
                <Link to="/settings" className="flex-1 ml-2">
                  <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
              
              <Button variant="outline" size="sm" className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
              
              {/* Mobile Language Selector */}
              <select className="w-full px-3 py-2 rounded-lg border border-border bg-background">
                <option value="en">🇬🇧 English</option>
                <option value="ml">🇮🇳 മലയാളം</option>
                <option value="ta">🇮🇳 தமിழ്</option>
                <option value="te">🇮🇳 తెలుగు</option>
                <option value="kn">🇮🇳 ಕನ್ನಡ</option>
                <option value="hi">🇮🇳 हिन्दी</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;