import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, Mail, Phone, Shield, Crown, LogOut, Settings, 
  History, CreditCard, Building2, BarChart3, AlertTriangle,
  CheckCircle, Flag, Scan, TrendingUp, Calendar
} from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Mock analytics data - in production this would come from API
  const analytics = {
    threatsBlocked: 47,
    scamsReported: 12,
    scansPerformed: 156,
    protectionScore: 92,
    monthlyActivity: [
      { month: 'Jan', threats: 8, scans: 45 },
      { month: 'Feb', threats: 5, scans: 38 },
    ],
    recentActivity: [
      { type: 'scan', description: 'Full device scan completed', time: '2 hours ago', status: 'success' },
      { type: 'block', description: 'Blocked suspicious call from +254-711-XXX', time: '5 hours ago', status: 'danger' },
      { type: 'report', description: 'Reported M-Pesa fraud attempt', time: '1 day ago', status: 'warning' },
      { type: 'scan', description: 'Quick scan - 23 messages checked', time: '2 days ago', status: 'success' },
    ]
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Not Signed In</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to view your profile and protection history.
            </p>
            <div className="flex gap-3">
              <Link to="/signin" className="flex-1">
                <Button className="w-full">Sign In</Button>
              </Link>
              <Link to="/signup" className="flex-1">
                <Button variant="outline" className="w-full">Sign Up</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShieldIcon className="w-8 h-8 text-primary" variant="safe" />
            <span className="font-display font-bold text-xl text-foreground">
              Scam<span className="text-primary">Alert</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Profile Header */}
      <section className="pt-24 pb-8 px-4 bg-gradient-hero">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="w-24 h-24 border-4 border-primary-foreground/20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-foreground">
                {user?.name || "User"}
              </h1>
              <p className="text-primary-foreground/70">{user?.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  user?.plan === 'premium' 
                    ? 'bg-accent/20 text-accent border border-accent/30' 
                    : 'bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20'
                }`}>
                  {user?.plan === 'premium' ? (
                    <><Crown className="w-3 h-3" /> Premium</>
                  ) : (
                    <><Shield className="w-3 h-3" /> Free Plan</>
                  )}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-safe/20 text-safe border border-safe/30">
                  <CheckCircle className="w-3 h-3" /> Active
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/settings">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Overview */}
      <section className="py-6 px-4 -mt-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: analytics.threatsBlocked, label: 'Threats Blocked', icon: Shield, color: 'text-primary' },
              { value: analytics.scamsReported, label: 'Scams Reported', icon: Flag, color: 'text-danger' },
              { value: analytics.scansPerformed, label: 'Total Scans', icon: Scan, color: 'text-safe' },
              { value: `${analytics.protectionScore}%`, label: 'Protection Score', icon: TrendingUp, color: 'text-accent' },
            ].map((stat, i) => (
              <Card key={i} className="bg-card/80 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Protection Score */}
      <section className="py-4 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Protection Score
              </CardTitle>
              <CardDescription>
                Your overall security rating based on activity and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-foreground">{analytics.protectionScore}%</span>
                  <span className="text-safe font-medium">Excellent</span>
                </div>
                <Progress value={analytics.protectionScore} className="h-3" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {[
                    { label: 'Real-time Protection', status: true },
                    { label: 'SMS Scanning', status: true },
                    { label: 'Call Monitoring', status: true },
                    { label: 'Auto-block Enabled', status: user?.plan === 'premium' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {item.status ? (
                        <CheckCircle className="w-4 h-4 text-safe" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      )}
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-4 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.status === 'success' ? 'bg-safe/10 text-safe' :
                      activity.status === 'danger' ? 'bg-danger/10 text-danger' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {activity.type === 'scan' ? <Scan className="w-4 h-4" /> :
                       activity.type === 'block' ? <Shield className="w-4 h-4" /> :
                       <Flag className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Account Info & Actions */}
      <section className="py-4 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{user?.phone || "Not set"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Link to="/app">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <History className="w-5 h-5" />
                    Protection Dashboard
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <CreditCard className="w-5 h-5" />
                    {user?.plan === 'premium' ? 'Manage Subscription' : 'Upgrade Plan'}
                  </Button>
                </Link>
                <Link to="/business-register">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Building2 className="w-5 h-5" />
                    Register Business
                  </Button>
                </Link>
                <Link to="/report">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Flag className="w-5 h-5" />
                    Report a Scam
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Logout */}
      <section className="py-4 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Profile;
