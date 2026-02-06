import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Flag, AlertTriangle, Phone, MessageSquare, CreditCard, 
  Send, CheckCircle, Loader2, Shield, Users, ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { normalizePhone } from "@/lib/phone";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://m-pesa-shield-1.onrender.com/api/v1';

type ReportType = "call" | "sms" | "payment" | "other";
type ScamCategory = "mpesa_fraud" | "phishing" | "impersonation" | "fake_prize" | "investment_scam" | "loan_scam" | "other";

const ReportScam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    reportType: "" as ReportType,
    scammerPhone: "",
    category: "" as ScamCategory,
    paymentMethod: "",
    paymentCode: "",
    amount: "",
    description: "",
    messageContent: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize phone number
    const normalizedPhone = normalizePhone(formData.scammerPhone);
    if (!normalizedPhone) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          scammerPhone: normalizedPhone,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Report Submitted",
          description: "Thank you for helping protect the community!",
        });
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-safe/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-safe" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Report Submitted!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your report has been received and will be reviewed. Thank you for helping protect others from fraud.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsSuccess(false)} className="flex-1">
                Submit Another
              </Button>
              <Link to="/app" className="flex-1">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShieldIcon className="w-8 h-8 text-primary" variant="safe" />
            <span className="font-display font-bold text-xl text-foreground">
              Scam<span className="text-primary">Alert</span>
            </span>
          </Link>
          <Link to="/app">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-8 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger/20 border border-danger/30 mb-6">
            <Flag className="w-4 h-4 text-danger" />
            <span className="text-sm font-medium text-primary-foreground">Report Fraud</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Report a Scam
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Help protect the community by reporting fraudulent calls, messages, and payment requests.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-6 px-4 -mt-4">
        <div className="container mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Flag, value: "12,847", label: "Reports Filed" },
              { icon: Shield, value: "KES 45M+", label: "Fraud Prevented" },
              { icon: Users, value: "2.1M", label: "Users Protected" },
            ].map((stat, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur text-center">
                <CardContent className="p-4">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Report Form */}
      <section className="py-6 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-danger" />
                Scam Report Form
              </CardTitle>
              <CardDescription>
                Provide as much detail as possible to help us investigate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Report Type */}
                <div className="space-y-3">
                  <Label>Type of Scam *</Label>
                  <RadioGroup
                    value={formData.reportType}
                    onValueChange={(value) => setFormData({ ...formData, reportType: value as ReportType })}
                    className="grid grid-cols-2 gap-3"
                  >
                    {[
                      { value: "call", label: "Phone Call", icon: Phone },
                      { value: "sms", label: "SMS/Text", icon: MessageSquare },
                      { value: "payment", label: "Payment Request", icon: CreditCard },
                      { value: "other", label: "Other", icon: AlertTriangle },
                    ].map((type) => (
                      <Label
                        key={type.value}
                        htmlFor={type.value}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.reportType === type.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
                        <type.icon className={`w-5 h-5 ${
                          formData.reportType === type.value ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <span className="font-medium">{type.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Scammer Phone */}
                <div className="space-y-2">
                  <Label htmlFor="scammerPhone">Scammer's Phone Number *</Label>
                  <Input
                    id="scammerPhone"
                    name="scammerPhone"
                    value={formData.scammerPhone}
                    onChange={handleChange}
                    placeholder="e.g., 0712345678 or +254712345678"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The phone number used by the scammer
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Scam Category *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, category: value as ScamCategory })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mpesa_fraud">M-Pesa Fraud</SelectItem>
                      <SelectItem value="phishing">Phishing/Fake Links</SelectItem>
                      <SelectItem value="impersonation">Business Impersonation</SelectItem>
                      <SelectItem value="fake_prize">Fake Prize/Lottery</SelectItem>
                      <SelectItem value="investment_scam">Investment Scam</SelectItem>
                      <SelectItem value="loan_scam">Fake Loan Offer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Details (conditional) */}
                {(formData.reportType === "payment" || formData.category === "mpesa_fraud") && (
                  <div className="space-y-4 p-4 rounded-xl bg-muted/50 border border-border">
                    <h4 className="font-medium text-foreground">Payment Details</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paybill">Paybill Number</SelectItem>
                            <SelectItem value="till">Till Number</SelectItem>
                            <SelectItem value="send_money">Send Money</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentCode">Paybill/Till/Phone</Label>
                        <Input
                          id="paymentCode"
                          name="paymentCode"
                          value={formData.paymentCode}
                          onChange={handleChange}
                          placeholder="e.g., 522522"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount Lost (if any)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="e.g., KES 5,000"
                      />
                    </div>
                  </div>
                )}

                {/* Message Content */}
                {(formData.reportType === "sms" || formData.reportType === "other") && (
                  <div className="space-y-2">
                    <Label htmlFor="messageContent">Scam Message Content</Label>
                    <Textarea
                      id="messageContent"
                      name="messageContent"
                      value={formData.messageContent}
                      onChange={handleChange}
                      placeholder="Paste or type the scam message here..."
                      rows={4}
                    />
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what happened, how they contacted you, etc..."
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting || !formData.reportType || !formData.scammerPhone}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ReportScam;
