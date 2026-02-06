import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, AlertTriangle, CheckCircle, Phone, MessageSquare, 
  Search, ChevronRight, Flag, ThumbsUp, ThumbsDown, 
  Scan, TrendingUp, FileWarning, Users, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldIcon } from './icons/ShieldIcon';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface Alert {
  id: number;
  type: 'call' | 'sms';
  number: string;
  threat: 'high' | 'medium' | 'low';
  category: string;
  time: string;
  blocked: boolean;
  verified: boolean;
  verifiedFrom?: string;
}

interface ScanResult {
  totalScanned: number;
  threatsFound: number;
  threats: any[];
  cleanMessages: number;
}

const ScamAlertApp: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'calls' | 'sms'>('calls');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [showScanResults, setShowScanResults] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Sample data - in production this would come from API
  const recentAlerts: Alert[] = [
    { id: 1, type: 'call', number: '+254-700-123456', threat: 'high', category: 'M-Pesa Scam', time: '2 min ago', blocked: true, verified: false },
    { id: 2, type: 'sms', number: 'Safaricom', threat: 'low', category: 'Mpesa Alert', time: '15 min ago', blocked: false, verified: true, verifiedFrom: 'Safaricom' },
    { id: 3, type: 'call', number: 'KCB Bank', threat: 'low', category: 'Account Security', time: '1 hour ago', blocked: false, verified: true, verifiedFrom: 'KCB Bank' },
    { id: 4, type: 'sms', number: 'Equity Bank', threat: 'low', category: 'OTP Verification', time: '3 hours ago', blocked: false, verified: true, verifiedFrom: 'Equity Bank' },
    { id: 5, type: 'sms', number: '+254-711-000000', threat: 'high', category: 'Phishing Link', time: '5 hours ago', blocked: true, verified: false },
    { id: 6, type: 'call', number: 'Jumia Kenya', threat: 'low', category: 'Order Confirmation', time: '6 hours ago', blocked: false, verified: true, verifiedFrom: 'Jumia' },
  ];

  const stats = {
    blocked: 127,
    reported: 43,
    community: '2.1M',
    scansToday: 58
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setShowScanResults(false);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanResults({
            totalScanned: 847,
            threatsFound: 12,
            threats: [
              { number: '+254-722-9876', type: 'sms', category: 'Phishing Link', threat: 'high', date: 'Feb 5, 2026' },
              { number: '+254-733-5432', type: 'call', category: 'Fake M-Pesa Agent', threat: 'high', date: 'Feb 4, 2026' },
              { number: '+254-700-1111', type: 'sms', category: 'Fake Prize', threat: 'high', date: 'Feb 3, 2026' },
            ],
            cleanMessages: 835
          });
          setShowScanResults(true);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const getThreatBadgeClass = (threat: string) => {
    switch (threat) {
      case 'high': return 'bg-danger/10 text-danger border-danger/30';
      case 'medium': return 'bg-warning/10 text-warning border-warning/30';
      default: return 'bg-safe/10 text-safe border-safe/30';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShieldIcon className="w-8 h-8 text-primary" variant="safe" />
            <span className="font-display font-bold text-xl text-foreground">
              TrustGuard<span className="text-primary">Unit</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/report">
              <Button variant="outline" size="sm" className="gap-2">
                <Flag className="w-4 h-4" />
                <span className="hidden sm:inline">Report Scam</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-hero">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">
                {isAuthenticated ? `Welcome, ${user?.name?.split(' ')[0] || 'User'}!` : 'Protection Dashboard'}
              </h1>
              <p className="text-primary-foreground/70 text-lg">
                Real-time fraud detection & protection
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-safe/20 border border-safe/30">
                <div className="w-2 h-2 bg-safe rounded-full animate-pulse" />
                <span className="text-safe font-medium text-sm">Protection Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-6 px-4 -mt-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: stats.blocked, label: 'Threats Blocked', icon: Shield, color: 'text-primary' },
              { value: stats.reported, label: 'Scams Reported', icon: Flag, color: 'text-danger' },
              { value: stats.scansToday, label: 'Scans Today', icon: Scan, color: 'text-safe' },
              { value: stats.community, label: 'Protected Users', icon: Users, color: 'text-accent' },
            ].map((stat, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur">
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

      {/* Scan Section */}
      <section className="py-4 px-4">
        <div className="container mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-primary" />
                Quick Scan
              </CardTitle>
              <CardDescription>
                Scan your messages and calls for potential threats
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
                    />
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                  <p className="text-center text-muted-foreground">
                    Scanning messages & calls... {scanProgress}%
                  </p>
                </div>
              ) : showScanResults && scanResults ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-safe/10 border border-safe/30">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-safe" />
                      <div>
                        <p className="font-semibold text-foreground">Scan Complete</p>
                        <p className="text-sm text-muted-foreground">
                          {scanResults.totalScanned} items scanned
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-danger">{scanResults.threatsFound}</p>
                      <p className="text-xs text-muted-foreground">Threats Found</p>
                    </div>
                  </div>
                  
                  {scanResults.threats.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Detected Threats:</h4>
                      {scanResults.threats.map((threat, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-danger/5 border border-danger/20">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-danger" />
                            <div>
                              <p className="font-medium text-foreground">{threat.number}</p>
                              <p className="text-sm text-muted-foreground">{threat.category}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{threat.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button onClick={handleScan} className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Scan Again
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Search className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Run a quick scan to check for potential threats in your messages and calls
                  </p>
                  <Button onClick={handleScan} size="lg" className="gap-2">
                    <Scan className="w-5 h-5" />
                    Start Scan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Alerts */}
      <section className="py-4 px-4">
        <div className="container mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={selectedTab === 'calls' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTab('calls')}
                    className="gap-1"
                  >
                    <Phone className="w-4 h-4" />
                    Calls
                  </Button>
                  <Button
                    variant={selectedTab === 'sms' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTab('sms')}
                    className="gap-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    SMS
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {recentAlerts
                    .filter(alert => selectedTab === 'calls' ? alert.type === 'call' : alert.type === 'sms')
                    .map(alert => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-start justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-colors bg-card"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            alert.verified 
                              ? 'bg-safe/10 text-safe' 
                              : alert.threat === 'high' 
                                ? 'bg-danger/10 text-danger' 
                                : 'bg-warning/10 text-warning'
                          }`}>
                            {alert.verified ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <AlertTriangle className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{alert.number}</span>
                              {alert.verified && (
                                <span className="inline-flex items-center gap-1 text-xs bg-safe/10 text-safe px-2 py-0.5 rounded-full border border-safe/30">
                                  <CheckCircle className="w-3 h-3" />
                                  Verified
                                </span>
                              )}
                              {alert.blocked && (
                                <span className="inline-flex items-center gap-1 text-xs bg-danger/10 text-danger px-2 py-0.5 rounded-full border border-danger/30">
                                  <AlertTriangle className="w-3 h-3" />
                                  Blocked
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {alert.category}
                              {alert.verifiedFrom && <span className="text-safe"> • {alert.verifiedFrom}</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                          {!alert.verified && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-danger hover:text-danger hover:bg-danger/10">
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-safe hover:text-safe hover:bg-safe/10">
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-4 px-4">
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/report">
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center group-hover:bg-danger/20 transition-colors">
                    <FileWarning className="w-6 h-6 text-danger" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Report a Scam</h3>
                    <p className="text-sm text-muted-foreground">Help protect the community</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/business-register">
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-safe/10 flex items-center justify-center group-hover:bg-safe/20 transition-colors">
                    <Shield className="w-6 h-6 text-safe" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Verify Business</h3>
                    <p className="text-sm text-muted-foreground">Register as legitimate</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/pricing">
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Upgrade Plan</h3>
                    <p className="text-sm text-muted-foreground">Get premium protection</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScamAlertApp;
