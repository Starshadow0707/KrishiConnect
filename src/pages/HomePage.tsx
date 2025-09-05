import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Award, 
  TrendingUp, 
  Shield,
  MessageCircle,
  CheckCircle2,
  Star,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI-Powered Chat",
      description: "Get instant farming advice in your local language with our advanced AI assistant",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Real-time commodity prices and market trends to maximize your profits",
      color: "bg-success/10 text-success"
    },
    {
      icon: Shield,
      title: "Disease Detection",
      description: "Upload crop photos for instant disease identification and treatment advice",
      color: "bg-warning/10 text-warning"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Connect with agricultural experts and experienced farmers in your region",
      color: "bg-accent/10 text-accent"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Palakkad, Kerala",
      rating: 5,
      comment: "KrishiConnect helped me identify pest issues early and saved my entire crop. The AI assistant is incredibly accurate!",
      crop: "Rice Farmer"
    },
    {
      name: "Priya Nair",
      location: "Thrissur, Kerala",
      rating: 5,
      comment: "The market price alerts helped me sell my spices at the right time. Increased my income by 25% this season!",
      crop: "Spice Farmer"
    },
    {
      name: "Mohammed Salim",
      location: "Kozhikode, Kerala",
      rating: 5,
      comment: "Weather predictions are spot-on. I can plan my irrigation and harvesting perfectly now.",
      crop: "Coconut Farmer"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Farmers" },
    { number: "2M+", label: "Queries Answered" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "30+", label: "Languages Supported" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for <span className="text-gradient">Smart Farming</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive digital tools designed specifically for Kerala farmers to increase productivity and profits
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="agricultural-card group hover:scale-105 transform transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-4 rounded-xl ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-gradient">Kerala Farmers</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real stories from farmers who transformed their farming with KrishiConnect
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="agricultural-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.crop}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="agricultural-card bg-gradient-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Farming?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of Kerala farmers who are already using AI to increase their crop yield and profits
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/chat">
                  <Button variant="secondary" size="xl" className="group">
                    Start Free AI Chat
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
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 KrishiConnect - Kerala Government Initiative</p>
            <p className="text-sm">Empowering farmers with AI-driven agricultural solutions</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;