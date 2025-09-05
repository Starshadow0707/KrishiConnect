import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, 
  CloudSun, 
  TrendingUp, 
  Leaf, 
  AlertTriangle,
  CheckCircle2,
  Activity,
  Users
} from "lucide-react";

const DashboardStats = () => {
  const stats = [
    {
      title: "AI Queries Today",
      value: "24",
      change: "+12%",
      icon: MessageCircle,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Weather Alerts",
      value: "2",
      change: "Active",
      icon: CloudSun,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Market Trends",
      value: "↑ 5.2%",
      change: "This week",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Crop Health",
      value: "Good",
      change: "3 crops monitored",
      icon: Leaf,
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ];

  const quickActions = [
    {
      title: "Disease Alert",
      description: "Early blight detected in tomatoes",
      priority: "high",
      icon: AlertTriangle,
      action: "View Details"
    },
    {
      title: "Irrigation Reminder",
      description: "Next watering in 2 days",
      priority: "medium",
      icon: Activity,
      action: "Schedule"
    },
    {
      title: "Market Update",
      description: "Rice prices increased by 8%",
      priority: "low",
      icon: TrendingUp,
      action: "Check Prices"
    }
  ];

  const recentQueries = [
    {
      query: "How to treat leaf curl in tomatoes?",
      timestamp: "2 hours ago",
      status: "answered"
    },
    {
      query: "Best time to harvest paddy?",
      timestamp: "5 hours ago",
      status: "answered"
    },
    {
      query: "Organic pest control methods",
      timestamp: "1 day ago",
      status: "answered"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="agricultural-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.color}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="agricultural-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alerts & Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const priorityColors = {
                high: "border-l-destructive bg-destructive/5",
                medium: "border-l-warning bg-warning/5",
                low: "border-l-primary bg-primary/5"
              };
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${priorityColors[action.priority as keyof typeof priorityColors]}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-primary hover:underline">
                      {action.action}
                    </button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Queries */}
        <Card className="agricultural-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Recent AI Queries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentQueries.map((query, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{query.query}</p>
                  <p className="text-xs text-muted-foreground">{query.timestamp}</p>
                </div>
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                  {query.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;