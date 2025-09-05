import { Link } from "react-router-dom";
import { 
  MessageCircle, 
  Home, 
  CloudSun, 
  TrendingUp, 
  User,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Leaf,
  Heart
} from "lucide-react";
import krishiLogo from "@/assets/krishi-logo.png";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "AI Chat", href: "/chat" },
    { name: "Weather", href: "/weather" },
    { name: "Market Prices", href: "/market" },
    { name: "Profile", href: "/profile" },
  ];

  const resources = [
    { name: "Farming Tips", href: "/tips" },
    { name: "Crop Calendar", href: "/calendar" },
    { name: "Disease Guide", href: "/diseases" },
    { name: "Fertilizer Guide", href: "/fertilizers" },
    { name: "Help Center", href: "/help" },
  ];

  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com/krishiconnect", icon: Facebook },
    { name: "Twitter", href: "https://twitter.com/krishiconnect", icon: Twitter },
    { name: "Instagram", href: "https://instagram.com/krishiconnect", icon: Instagram },
    { name: "YouTube", href: "https://youtube.com/krishiconnect", icon: Youtube },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={krishiLogo} 
                alt="KrishiConnect Logo" 
                className="h-10 w-10 rounded-lg"
              />
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gradient">KrishiConnect</h2>
                <p className="text-xs text-muted-foreground">AI Farmer Advisory</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Empowering farmers with AI-driven insights, real-time weather data, 
              and market intelligence for sustainable agriculture.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Leaf className="h-4 w-4 text-green-600" />
              <span>Growing together for a better tomorrow</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link 
                    to={resource.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@krishiconnect.in</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 1800-123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Kerala, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Follow Us</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                      title={social.name}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© 2025 KrishiConnect. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for farmers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
