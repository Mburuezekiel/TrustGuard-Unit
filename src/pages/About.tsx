import { ShieldIcon } from "@/components/icons/ShieldIcon";
import {Header} from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Brain, 
  Cloud, 
  Server, 
  Lock, 
  Users, 
  Globe, 
  Zap,
  Shield,
  Target,
  Heart,
  Database,
  Link2,
  Cpu,
  Mic,
  FileCheck
} from "lucide-react";

const techStack = [
  {
    name: "OpenAI GPT-4.1",
    description: "Scam message understanding, intent classification, and real-time risk scoring with advanced NLP.",
    icon: Brain,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    name: "Google Cloud Speech-to-Text",
    description: "Analyzing suspicious voice calls with real-time transcription and intent detection.",
    icon: Mic,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "AWS SageMaker",
    description: "Custom fraud detection models trained on millions of scam patterns for highest accuracy.",
    icon: Cpu,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    name: "AWS Managed Blockchain",
    description: "Immutable message logging ensuring tamper-resistant delivery of OTPs and verification codes.",
    icon: Link2,
    color: "bg-purple-500/10 text-purple-500",
  },
];

const infrastructure = [
  {
    name: "Amazon QLDB",
    description: "Cryptographically verifiable audit trails for all security events.",
    icon: FileCheck,
  },
  {
    name: "AWS SNS",
    description: "Large-scale SMS delivery for alerts and OTP notifications.",
    icon: Zap,
  },
  {
    name: "AWS Lambda",
    description: "Serverless compute for instant, scalable threat analysis.",
    icon: Server,
  },
  {
    name: "Amazon DynamoDB",
    description: "Real-time scam reputation storage with sub-millisecond latency.",
    icon: Database,
  },
  {
    name: "Amazon Cognito",
    description: "Enterprise-grade user authentication and identity management.",
    icon: Lock,
  },
  {
    name: "Amazon S3",
    description: "Encrypted evidence storage with compliance-ready audit capabilities.",
    icon: Cloud,
  },
];

const values = [
  {
    title: "Privacy First",
    description: "Messages are analyzed locally first. We never store personal financial information.",
    icon: Lock,
  },
  {
    title: "Community Powered",
    description: "Collective intelligence from 2.1M+ user reports strengthens protection for everyone.",
    icon: Users,
  },
  {
    title: "Inclusive Design",
    description: "Built for everyone—from first-time smartphone users to tech-savvy professionals.",
    icon: Heart,
  },
  {
    title: "Global Intelligence",
    description: "Trained on regional scam patterns, local languages, and institution-specific tactics.",
    icon: Globe,
  },
];

const stats = [
  { value: "2.1M+", label: "Scams Blocked" },
  { value: "500K+", label: "Protected Users" },
  { value: "<200ms", label: "Detection Time" },
  { value: "99.7%", label: "Accuracy Rate" },
];

const targetUsers = [
  { title: "Individuals", desc: "Personal protection against phishing, impersonation, and social engineering" },
  { title: "Fintechs", desc: "API integration for transaction fraud prevention and customer protection" },
  { title: "Merchants", desc: "Secure payment verification and customer communication protection" },
  { title: "Crypto Platforms", desc: "Blockchain-verified OTPs and escrow payment notifications" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 mb-6">
            <Shield className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">About ScamAlert by TrustGuardUnit</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            AI + Blockchain + Cloud
            <span className="block mt-2 bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent">
              United Against Fraud
            </span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            ScamAlert is a real-time fraud detection platform that uses OpenAI GPT-4.1, Google Cloud Speech-to-Text, 
            AWS SageMaker, and blockchain infrastructure to detect, classify, and warn users about fraudulent 
            calls and SMS messages before they make financial decisions.
          </p>
          <div className="inline-block px-6 py-3 rounded-full bg-accent/20 border border-accent/30">
            <span className="text-accent font-semibold">
              "Protecting users before money is lost"
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 -mt-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center p-6 bg-card/50 backdrop-blur">
                <CardContent className="p-0">
                  <div className="font-display text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 mb-6">
                <Target className="w-4 h-4 text-danger" />
                <span className="text-sm font-medium text-danger">The Problem</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Financial Fraud is Exploding
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Every day, millions of users receive fake messages from scammers impersonating banks, 
                government agencies, and trusted institutions. Sophisticated AI-generated phishing attacks 
                make it nearly impossible for humans to detect.
              </p>
              <p className="text-lg text-muted-foreground">
                The most affected are first-time smartphone users, the elderly, students, 
                small traders, and anyone using mobile money or online banking.
              </p>
            </div>
            <div className="bg-primary/5 rounded-3xl p-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-safe/10 mb-6">
                <Shield className="w-4 h-4 text-safe" />
                <span className="text-sm font-medium text-safe">The Solution</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                ScamAlert: Your AI Safety Net
              </h3>
              <ul className="space-y-3">
                {[
                  "Real-time AI analysis of incoming messages",
                  "Voice call transcription and threat detection",
                  "Blockchain-verified OTPs and notifications",
                  "Community-powered scam database",
                  "Explainable alerts you can understand",
                  "TrustCard for fraud-protected payments"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <div className="w-5 h-5 rounded-full bg-safe/20 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-safe" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI & ML Technology Stack */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI & Machine Learning</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              World-Class Intelligence Stack
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by the most advanced AI models and cloud ML infrastructure available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {techStack.map((tech) => (
              <Card key={tech.name} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${tech.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <tech.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tech.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud Infrastructure */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 mb-6">
              <Cloud className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-500">Cloud Infrastructure</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Enterprise-Grade AWS Architecture
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on secure, scalable AWS infrastructure with blockchain verification.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {infrastructure.map((item) => (
              <div key={item.name} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Who We Protect
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {targetUsers.map((user) => (
              <Card key={user.title} className="text-center">
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{user.title}</h3>
                  <p className="text-sm text-muted-foreground">{user.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Get Protected?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join 500K+ users who trust ScamAlert to keep their finances safe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app">
              <Button variant="hero" size="xl">Try ScamAlert Free</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="heroOutline" size="xl">View Pricing</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-background">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 ScamAlert by TrustGuardUnit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
