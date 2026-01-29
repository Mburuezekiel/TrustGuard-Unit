import { ShieldIcon } from "@/components/icons/ShieldIcon";
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
  Heart
} from "lucide-react";

const techStack = [
  {
    name: "OpenAI GPT-4",
    description: "Advanced natural language understanding for detecting sophisticated scam patterns and social engineering tactics.",
    icon: Brain,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    name: "Claude AI (Anthropic)",
    description: "Constitutional AI for explainable fraud alerts that users can understand and learn from.",
    icon: Zap,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    name: "AWS Infrastructure",
    description: "Enterprise-grade cloud infrastructure ensuring 99.99% uptime and sub-second response times.",
    icon: Cloud,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "AWS Lambda",
    description: "Serverless computing for scalable real-time message analysis, handling millions of requests.",
    icon: Server,
    color: "bg-purple-500/10 text-purple-500",
  },
];

const values = [
  {
    title: "Privacy First",
    description: "Your messages are analyzed locally first. We never store personal financial information.",
    icon: Lock,
  },
  {
    title: "Community Powered",
    description: "Collective intelligence from user reports strengthens protection for everyone.",
    icon: Users,
  },
  {
    title: "Inclusive Design",
    description: "Built for everyone—from first-time smartphone users to tech-savvy professionals.",
    icon: Heart,
  },
  {
    title: "Local Intelligence",
    description: "Trained on regional scam patterns, local languages, and financial institution-specific tactics.",
    icon: Globe,
  },
];

const stats = [
  { value: "2M+", label: "Scams Blocked" },
  { value: "100K+", label: "Protected Users" },
  { value: "<1s", label: "Detection Time" },
  { value: "99.9%", label: "Accuracy Rate" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
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
            <Link to="/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="default" size="sm">Get Protected</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 mb-6">
            <Shield className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">About TrustGuardUnit</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Protecting Users Before
            <span className="block mt-2 bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent">
              Money Is Lost
            </span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            TrustGuardUnit is a real-time fraud detection platform built specifically for 
            mobile money ecosystems. We analyze messages, detect scams, and alert users before they act.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Mission</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
                A Digital Safety Net for Everyone
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Mobile money is the backbone of emerging economies—but it has also become 
                the primary attack surface for fraud. Every day, millions of users receive 
                fake messages, social engineering scams, and impersonation attempts.
              </p>
              <p className="text-lg text-muted-foreground">
                The most affected are first-time smartphone users, the elderly, students, 
                and small traders. TrustGuardUnit exists to protect them.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="text-center p-6">
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
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered By</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              World-Class AI & Infrastructure
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on secure and scalable infrastructure, powered by the most advanced AI models.
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

      {/* Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we build.
            </p>
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
            Join thousands of users who trust TrustGuardUnit to keep their finances safe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button variant="hero" size="xl">Start Free Protection</Button>
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
            © 2025 TrustGuardUnit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
