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
  Leaf
} from "lucide-react";
import krishiLogo from "@/assets/krishi-logo.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "AI Chat", href: "/chat", icon: MessageCircle },
    { name: "Weather", href: "/weather", icon: CloudSun },
    { name: "Market", href: "/market", icon: TrendingUp },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={krishiLogo} 
              alt="KrishiConnect Logo" 
              className="h-10 w-10 rounded-lg"
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gradient">KrishiConnect</h1>
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

          {/* Language Selector */}
          <div className="hidden md:flex items-center space-x-2">
            <select className="px-3 py-1 rounded-md border border-border bg-background text-sm">
              <option value="en">English</option>
              <option value="ml">മലയാളം</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="hi">हिन्दी</option>
            </select>
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
            
            {/* Mobile Language Selector */}
            <div className="mt-4 pt-4 border-t border-border">
              <select className="w-full px-3 py-2 rounded-md border border-border bg-background">
                <option value="en">English</option>
                <option value="ml">മലയാളം</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;