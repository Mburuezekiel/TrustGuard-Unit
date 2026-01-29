import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldIcon } from "./icons/ShieldIcon";
import { 
  Smartphone, 
  Phone, 
  MessageSquare, 
  Check, 
  Shield, 
  Zap,
  Send,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const features = [
  {
    icon: Phone,
    title: "Works with Any Phone",
    description: "Basic phones, feature phones, and smartphones all supported via SMS.",
  },
  {
    icon: MessageSquare,
    title: "Forward Messages for Analysis",
    description: "Simply forward suspicious messages to our short code for instant analysis.",
  },
  {
    icon: Bell,
    title: "Receive Alerts via SMS",
    description: "Get fraud warnings and safety tips delivered directly to your phone.",
  },
  {
    icon: Shield,
    title: "No App Required",
    description: "Protection without downloading any application or using data.",
  },
];

export const SMSGatewayService = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setIsRegistered(true);
      toast({
        title: "Registration Successful!",
        description: "You'll receive a confirmation SMS shortly.",
      });
    }
  };

  const simulateSMSCheck = () => {
    toast({
      title: "SMS Analysis Complete",
      description: "⚠️ Warning: This message contains fraud indicators. Do not send money.",
      variant: "destructive",
    });
  };

  return (
    <section id="sms-service" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">SMS Gateway Service</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Protection for Everyone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't have a smartphone? No problem. Our SMS Gateway brings fraud protection 
            to any phone that can send and receive text messages.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Features */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">
              How It Works
            </h3>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={feature.title} className="flex gap-4 p-4 rounded-xl bg-background border border-border">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="font-semibold text-foreground">Short Code:*765#</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Forward any suspicious message to this short code. You'll receive 
                an instant analysis telling you if it's safe or a scam.
              </p>
            </div>
          </div>

          {/* Registration Card */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="w-6 h-6" variant="safe" />
                Register for SMS Protection
              </CardTitle>
              <CardDescription>
                Enter your phone number to start receiving fraud alerts and access the SMS analysis service.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="register" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="register">Register</TabsTrigger>
                  <TabsTrigger value="demo">Try Demo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="register" className="space-y-4 mt-4">
                  {!isRegistered ? (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+254 7XX XXX XXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" size="lg">
                        <Send className="w-4 h-4 mr-2" />
                        Register Now
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Standard SMS rates apply. No data required.
                      </p>
                    </form>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 rounded-full bg-safe/10 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-safe" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">You're Registered!</h4>
                      <p className="text-muted-foreground text-sm mb-4">
                        Forward suspicious messages to <strong>20XXX</strong> for instant analysis.
                      </p>
                      <Button variant="outline" onClick={() => setIsRegistered(false)}>
                        Register Another Number
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="demo" className="space-y-4 mt-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium mb-2">Sample Scam Message:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "Congratulations! You've won KES 500,000. Send KES 1,000 registration fee to 
                      account 123456 to claim your prize immediately!"
                    </p>
                  </div>
                  <Button onClick={simulateSMSCheck} className="w-full" variant="danger" size="lg">
                    <Shield className="w-4 h-4 mr-2" />
                    Analyze This Message
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    This is a demo. In real use, you'd forward the message to our short code.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
