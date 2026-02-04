import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, Phone, MessageSquare, 
  Search, Menu, X, ChevronRight, Flag, ThumbsUp, ThumbsDown, 
  CreditCard, Eye, EyeOff, Copy, Wallet, ArrowDownLeft,
  Scan, TrendingUp, Bell, Settings, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [currentScreen, setCurrentScreen] = useState<'home' | 'report' | 'scan' | 'trustcard' | 'settings'>('home');
  const [selectedTab, setSelectedTab] = useState<'calls' | 'sms'>('calls');
  const [reportType, setReportType] = useState<'spam' | 'scam' | 'phishing'>('spam');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [showScanResults, setShowScanResults] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'usd' | 'crypto'>('usd');

  // Sample data - in production this would come from API
  const recentAlerts: Alert[] = [
    { id: 1, type: 'call', number: '+1-555-0123', threat: 'high', category: 'IRS Scam', time: '2 min ago', blocked: true, verified: false },
    { id: 2, type: 'sms', number: 'Chase Bank', threat: 'low', category: 'Transaction Alert', time: '15 min ago', blocked: false, verified: true, verifiedFrom: 'Chase Bank' },
    { id: 3, type: 'call', number: 'PayPal Support', threat: 'low', category: 'Account Security', time: '1 hour ago', blocked: false, verified: true, verifiedFrom: 'PayPal' },
    { id: 4, type: 'sms', number: 'Wells Fargo', threat: 'low', category: 'OTP Verification', time: '3 hours ago', blocked: false, verified: true, verifiedFrom: 'Wells Fargo' },
    { id: 5, type: 'sms', number: '+1-555-0147', threat: 'high', category: 'Phishing Link', time: '5 hours ago', blocked: true, verified: false },
    { id: 6, type: 'call', number: 'Amazon Care', threat: 'low', category: 'Order Confirmation', time: '6 hours ago', blocked: false, verified: true, verifiedFrom: 'Amazon' },
  ];

  const stats = {
    blocked: 127,
    reported: 43,
    community: '2.1M'
  };

  const virtualCard = {
    number: '4532 7821 6543 9876',
    holder: 'JOHN DOE',
    expiry: '12/28',
    cvv: '123',
    usd: { balance: '$2,450.00', limit: '$5,000.00' },
    crypto: { btc: '0.0523 BTC', eth: '1.24 ETH', total: '$3,890.00' }
  };

  const handleReport = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentScreen('home');
      setPhoneNumber('');
      setMessageText('');
    }, 2000);
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setCurrentScreen('scan');
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanResults({
            totalScanned: 847,
            threatsFound: 12,
            threats: [
              { number: '+1-555-9876', type: 'sms', category: 'Phishing Link', threat: 'high', date: 'Jan 30, 2026' },
              { number: '+1-555-5432', type: 'call', category: 'IRS Scam', threat: 'high', date: 'Jan 29, 2026' },
              { number: '+1-555-1111', type: 'sms', category: 'Fake Prize', threat: 'high', date: 'Jan 28, 2026' },
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
      case 'high': return 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/40';
      case 'medium': return 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-500/30';
      default: return 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative w-full max-w-[380px] h-[780px] rounded-[50px] p-3 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          boxShadow: '0 0 0 8px rgba(30, 41, 59, 0.6), 0 0 0 12px rgba(15, 23, 42, 0.4), 0 30px 60px rgba(0, 0, 0, 0.5)'
        }}>
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-950 rounded-b-3xl z-10 flex items-center justify-center">
          <div className="w-16 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Screen */}
        <div className="h-full rounded-[40px] overflow-hidden relative" 
          style={{ background: 'linear-gradient(to bottom, #0a0e1a 0%, #111827 100%)' }}>
          
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 text-white text-xs z-20">
            <span className="font-mono font-medium">9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-3 border border-white rounded-sm"></div>
              <div className="w-3 h-3 border border-white rounded-full"></div>
            </div>
          </div>

          {/* Content Area */}
          <div className="pt-12 pb-20 h-full overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* HOME SCREEN */}
              {currentScreen === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="text-blue-400" size={28} />
                        <h1 className="text-2xl font-bold text-white">ScamAlert</h1>
                      </div>
                      <p className="text-slate-400 text-sm">Stay protected 24/7</p>
                    </div>
                    <button className="p-3 rounded-xl backdrop-blur-xl bg-slate-800/50 border border-slate-700/50">
                      <Menu className="text-slate-300" size={20} />
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: stats.blocked, label: 'Blocked', color: 'blue' },
                      { value: stats.reported, label: 'Reported', color: 'blue' },
                      { value: stats.community, label: 'Community', color: 'blue' }
                    ].map((stat, i) => (
                      <div key={i} className="rounded-2xl p-4 border border-blue-500/30"
                        style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)' }}>
                        <div className={`text-${i === 2 ? '2xl' : '3xl'} font-bold text-${i === 2 ? 'blue-400' : 'white'} mb-1`}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Protection Status */}
                  <div className="rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Shield className="text-green-400" size={40} />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0"
                            >
                              <Shield className="text-green-400" size={40} />
                            </motion.div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white">Protection Active</div>
                            <div className="text-sm text-slate-400">Real-time monitoring</div>
                          </div>
                        </div>
                        <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mb-4">Last scan: 2 seconds ago</div>
                      
                      <button
                        onClick={handleScan}
                        className="w-full text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                        style={{ 
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                        }}
                      >
                        <Search size={18} />
                        Run Full Scan
                      </button>
                    </div>
                  </div>

                  {/* Tab Switcher */}
                  <div className="flex gap-2 rounded-2xl p-1 backdrop-blur-xl bg-slate-800/50 border border-slate-700/50">
                    {(['calls', 'sms'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                          selectedTab === tab 
                            ? 'text-white shadow-lg' 
                            : 'text-slate-400'
                        }`}
                        style={selectedTab === tab ? {
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                        } : {}}
                      >
                        {tab === 'calls' ? <Phone size={16} className="inline mr-2" /> : <MessageSquare size={16} className="inline mr-2" />}
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Recent Alerts */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-white font-bold text-lg">Recent Alerts</h2>
                      <button className="text-blue-400 text-sm font-medium">View All</button>
                    </div>
                    
                    <div className="space-y-3">
                      {recentAlerts
                        .filter(alert => selectedTab === 'calls' ? alert.type === 'call' : alert.type === 'sms')
                        .map(alert => (
                          <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all"
                            style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)' }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-xl shadow-lg ${
                                  alert.verified ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                                  getThreatBadgeClass(alert.threat)
                                }`}>
                                  {alert.verified ? <CheckCircle size={18} className="text-white" /> :
                                    alert.type === 'call' ? <Phone size={18} className="text-white" /> : <MessageSquare size={18} className="text-white" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-white font-semibold font-mono text-sm">{alert.number}</div>
                                    {alert.verified && (
                                      <div className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30">
                                        <CheckCircle size={10} className="text-green-400" />
                                        <span className="text-[10px] text-green-400 font-semibold">VERIFIED</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-slate-400 text-xs mt-1">
                                    {alert.category}
                                    {alert.verified && alert.verifiedFrom && (
                                      <span className="text-green-400"> • {alert.verifiedFrom}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-slate-500 mb-1">{alert.time}</div>
                                {alert.blocked && (
                                  <span className="inline-flex items-center gap-1 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                                    <AlertTriangle size={10} />
                                    Blocked
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {!alert.verified && (
                              <div className="flex gap-2">
                                <button className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg text-xs font-medium transition-colors border border-red-500/30">
                                  <ThumbsDown size={12} className="inline mr-1" />
                                  Don't Trust
                                </button>
                                <button className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 rounded-lg text-xs font-medium transition-colors border border-green-500/30">
                                  <ThumbsUp size={12} className="inline mr-1" />
                                  Trust
                                </button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCAN SCREEN */}
              {currentScreen === 'scan' && (
                <motion.div
                  key="scan"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <button onClick={() => setCurrentScreen('home')} className="p-2" disabled={isScanning}>
                      <X className="text-slate-300" size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-white">
                      {isScanning ? 'Scanning...' : 'Scan Results'}
                    </h1>
                    <div className="w-8"></div>
                  </div>

                  {isScanning && (
                    <div className="rounded-3xl p-8 backdrop-blur-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-center mb-8">
                        <div className="w-24 h-24 mx-auto mb-6 relative">
                          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent"
                          />
                          <Search className="absolute inset-0 m-auto text-blue-400" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Analyzing Messages & Calls</h3>
                        <p className="text-slate-400 text-sm">Scanning your device for threats...</p>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-blue-400 font-bold font-mono">{scanProgress}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${scanProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                          <div className="text-xs text-slate-400 mb-1">Messages Scanned</div>
                          <div className="text-lg font-bold text-white font-mono">
                            {Math.floor((scanProgress / 100) * 847)}
                          </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                          <div className="text-xs text-slate-400 mb-1">Threats Found</div>
                          <div className="text-lg font-bold text-red-400 font-mono">
                            {Math.floor((scanProgress / 100) * 12)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {showScanResults && scanResults && (
                    <div className="space-y-6">
                      <div className="rounded-3xl p-6 backdrop-blur-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Scan Complete</h3>
                            <p className="text-slate-400 text-sm">Found {scanResults.threatsFound} potential threats</p>
                          </div>
                          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="text-white" size={32} />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-white">{scanResults.totalScanned}</div>
                            <div className="text-xs text-slate-400">Scanned</div>
                          </div>
                          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-red-400">{scanResults.threatsFound}</div>
                            <div className="text-xs text-red-400">Threats</div>
                          </div>
                          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-green-400">{scanResults.cleanMessages}</div>
                            <div className="text-xs text-green-400">Clean</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                          <AlertTriangle className="text-red-400" size={20} />
                          Detected Threats
                        </h3>
                        
                        <div className="space-y-3">
                          {scanResults.threats.map((threat, index) => (
                            <div key={index} className="rounded-2xl p-4 border border-slate-700/50"
                              style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-xl ${getThreatBadgeClass(threat.threat)}`}>
                                    {threat.type === 'call' ? <Phone size={18} className="text-white" /> : <MessageSquare size={18} className="text-white" />}
                                  </div>
                                  <div>
                                    <div className="text-white font-semibold font-mono text-sm">{threat.number}</div>
                                    <div className="text-slate-400 text-xs mt-1">{threat.category}</div>
                                    <div className="text-slate-500 text-xs font-mono mt-1">{threat.date}</div>
                                  </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  threat.threat === 'high' 
                                    ? 'bg-red-500/20 text-red-400' 
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {threat.threat === 'high' ? 'High Risk' : 'Medium'}
                                </span>
                              </div>
                              
                              <button className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg text-xs font-medium transition-colors border border-red-500/30">
                                <Flag size={12} className="inline mr-1" />
                                Report This Threat
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowScanResults(false);
                            setScanResults(null);
                            setCurrentScreen('home');
                          }}
                          className="flex-1 text-white py-3 rounded-xl font-semibold"
                          style={{ 
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                          }}
                        >
                          Done
                        </button>
                        <button
                          onClick={handleScan}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-colors"
                        >
                          Scan Again
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* REPORT SCREEN */}
              {currentScreen === 'report' && (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <button onClick={() => setCurrentScreen('home')} className="p-2">
                      <X className="text-slate-300" size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-white">Report Scam</h1>
                    <div className="w-8"></div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-300 text-sm font-medium mb-2 block">
                        Phone Number / Sender ID
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 555 000 0000"
                        className="w-full px-4 py-3 rounded-xl text-white text-sm bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm font-medium mb-2 block">
                        Message / Call Details
                      </label>
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Paste the message text or describe the call..."
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl text-white text-sm bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm font-medium mb-2 block">
                        Category
                      </label>
                      <select className="w-full px-4 py-3 rounded-xl text-white text-sm bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none">
                        <option>IRS/Tax Scam</option>
                        <option>Bank Fraud</option>
                        <option>Tech Support Scam</option>
                        <option>Prize/Lottery Scam</option>
                        <option>Romance Scam</option>
                        <option>Phishing</option>
                        <option>Telemarketer</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleReport}
                    disabled={!phoneNumber}
                    className="w-full text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                    }}
                  >
                    Submit Report
                  </button>

                  <p className="text-xs text-slate-500 text-center">
                    Your report helps train our AI and protects millions of users worldwide
                  </p>
                </motion.div>
              )}

              {/* TRUSTCARD SCREEN */}
              {currentScreen === 'trustcard' && (
                <motion.div
                  key="trustcard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-white">TrustCard</h1>
                      <p className="text-slate-400 text-sm">Secure payments with fraud protection</p>
                    </div>
                    <button onClick={() => setCurrentScreen('home')} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <X className="text-slate-300" size={20} />
                    </button>
                  </div>

                  {/* Virtual Card */}
                  <div className="rounded-3xl p-6 relative overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                          <Shield className="text-white" size={24} />
                          <span className="text-white font-bold text-lg">TrustCard</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                          <div className="w-8 h-8 bg-white/30 rounded-full -ml-3"></div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-slate-300 uppercase">Card Number</span>
                          <button onClick={() => setShowCardDetails(!showCardDetails)}>
                            {showCardDetails ? <EyeOff size={14} className="text-blue-300" /> : <Eye size={14} className="text-blue-300" />}
                          </button>
                        </div>
                        <div className="text-white font-bold text-2xl font-mono tracking-wider">
                          {showCardDetails ? virtualCard.number : '•••• •••• •••• 9876'}
                        </div>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-xs text-slate-300 uppercase mb-1">Card Holder</div>
                          <div className="text-white font-semibold">{virtualCard.holder}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-300 uppercase mb-1">Expires</div>
                          <div className="text-white font-semibold font-mono">{virtualCard.expiry}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-300 uppercase mb-1">CVV</div>
                          <div className="text-white font-semibold font-mono">
                            {showCardDetails ? virtualCard.cvv : '***'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl p-4 backdrop-blur-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-xs text-slate-400 mb-2">Available Balance</div>
                      <div className="text-2xl font-bold text-white">{virtualCard.usd.balance}</div>
                    </div>
                    <button className="rounded-2xl p-4 backdrop-blur-xl bg-blue-500/20 border border-blue-500/30 text-center">
                      <ArrowDownLeft className="text-blue-400 mx-auto mb-2" size={24} />
                      <div className="text-white text-sm font-medium">Load Funds</div>
                    </button>
                  </div>

                  <div className="rounded-2xl p-4 border-l-4 border-blue-500 backdrop-blur-xl bg-slate-800/50">
                    <div className="flex gap-3">
                      <Shield className="text-blue-400 flex-shrink-0" size={20} />
                      <div className="text-sm text-slate-300">
                        Your TrustCard is protected by AI-powered fraud detection. Every transaction is monitored for suspicious activity in real-time.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SUCCESS OVERLAY */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-50"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="text-center"
                    >
                      <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-400" size={48} />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Report Submitted!</h2>
                      <p className="text-slate-400 text-sm">Thank you for protecting the community</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 h-20 px-6 flex items-center justify-around"
            style={{ background: 'linear-gradient(to top, #0a0e1a 0%, transparent 100%)' }}>
            {[
              { icon: Home, label: 'Home', screen: 'home' as const },
              { icon: Scan, label: 'Scan', action: handleScan },
              { icon: Flag, label: 'Report', screen: 'report' as const },
              { icon: CreditCard, label: 'Card', screen: 'trustcard' as const },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => item.action ? item.action() : setCurrentScreen(item.screen!)}
                className={`flex flex-col items-center gap-1 ${
                  currentScreen === item.screen ? 'text-blue-400' : 'text-slate-500'
                }`}
              >
                <item.icon size={22} />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScamAlertApp;
