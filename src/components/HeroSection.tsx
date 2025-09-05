import { Button } from "@/components/ui/button";
import { MessageCircle, CloudSun, TrendingUp, ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const quickActions = [
    {
      title: "Ask AI Assistant",
      description: "Get instant farming advice",
      icon: MessageCircle,
      href: "/chat",
      color: "bg-primary",
    },
    {
      title: "Check Weather",
      description: "7-day agricultural forecast",
      icon: CloudSun,
      href: "/weather",
      color: "bg-accent",
    },
    {
      title: "Market Prices",
      description: "Live commodity rates",
      icon: TrendingUp,
      href: "/market",
      color: "bg-success",
    },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Kerala Farmland"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect text-white mb-6">
            <Leaf className="h-4 w-4 text-green-300" />
            <span className="text-sm font-medium">Kerala Government Initiative</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="block">Krishi</span>
            <span className="block text-gradient bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
              Connect
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI-powered farming advisor for Kerala farmers. Get expert guidance, weather insights, 
            and market intelligence in your local language.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/chat">
              <Button variant="hero" size="xl" className="group">
                Start Chatting
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="glass" size="xl" className="group">
                View Dashboard
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-up">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className="group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="agricultural-card hover:scale-105 transform transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <div className={`inline-flex p-3 rounded-xl ${action.color} text-white mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-white/80 text-sm">{action.description}</p>
                  <ArrowRight className="h-4 w-4 mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;