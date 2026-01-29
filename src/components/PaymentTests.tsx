import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Upload, Search, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { ShieldIcon } from "./icons/ShieldIcon";

interface LookupResult {
  status: string;
  color: string;
  message: string;
}

interface SampleDBEntry {
  status: string;
  color: string;
  message: string;
}

interface SampleDB {
  [key: string]: SampleDBEntry;
}

export default function SniffSection(): JSX.Element {
  const [lookup, setLookup] = useState<string>("");
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [reportText, setReportText] = useState<string>("");
  const [certName, setCertName] = useState<string>("");
  const [certIssued, setCertIssued] = useState<boolean>(false);

  const sampleDB: SampleDB = {
    "093120": { status: "Safe", color: "safe", message: "No fraud reports found. Trusted account." },
    "01234": { status: "Not Safe", color: "danger", message: "Linked to reported fraud. Avoid payment." },
    "555555": { status: "Warning", color: "warning", message: "Limited reports. Proceed with caution." }
  };

  const handleLookup = (): void => {
    if (sampleDB[lookup]) {
      setLookupResult(sampleDB[lookup]);
    } else {
      setLookupResult({ status: "Unknown", color: "warning", message: "No data found. Proceed with caution." });
    }
  };

  const getResultStyles = (color: string) => {
    switch (color) {
      case "safe":
        return "bg-safe/10 text-safe border-safe/20";
      case "danger":
        return "bg-danger/10 text-danger border-danger/20";
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section id="sniff" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
            <ShieldIcon className="w-4 h-4" variant="safe" />
            <span className="text-sm font-medium text-primary">Sniff & Verify</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sniff Out Financial Scams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TrustGuardUnit sniffs out financial scams, detects scam signals in real time, 
            and warns users before risky payments using intelligence from real user reports.
          </p>
        </div>

        {/* Hero Card - Quick Lookup */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-16"
        >
          <Card className="rounded-2xl shadow-lg border-border">
            <CardContent className="p-6">
              <p className="text-sm font-medium mb-3 text-foreground">Quick Scam Lookup</p>
              <input
                value={lookup}
                onChange={(e) => setLookup(e.target.value)}
                placeholder="Enter account number, business ID, or phone..."
                className="w-full border border-border rounded-xl px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={handleLookup} className="mt-3 w-full" size="lg">
                <Search className="w-4 h-4 mr-2" />
                Check Risk
              </Button>
              {lookupResult && (
                <div className={`mt-4 p-4 rounded-xl text-sm border ${getResultStyles(lookupResult.color)}`}>
                  <strong>Status: {lookupResult.status}</strong> — {lookupResult.message}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Try: 093120 (safe), 01234 (danger), or 555555 (warning)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Workflow 1: Reporting */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl shadow-sm border-border h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground">Report a Fraud Case</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Paste the payment confirmation message or describe the scam so TrustGuardUnit 
                  can learn and protect others.
                </p>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Paste the suspicious message here..."
                  className="w-full border border-border rounded-xl p-4 h-32 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <Button className="mt-4 w-full" variant="outline">
                  <Upload className="mr-2 w-4 h-4" /> Submit Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Workflow 2: Certificate Request */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl shadow-sm border-border h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-safe/10 flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-safe" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground">Get Compliance Certificate</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Request a digital certificate to prove you or your business has 
                  no recorded financial fraud.
                </p>
                <input
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  placeholder="Enter your name or business name"
                  className="w-full border border-border rounded-xl px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={() => setCertIssued(true)} className="mt-4 w-full" variant="safe">
                  <BadgeCheck className="mr-2 w-4 h-4" /> Request Certificate
                </Button>

                {certIssued && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-5 border border-safe/20 rounded-xl bg-safe/5 text-center"
                  >
                    <ShieldCheck className="mx-auto mb-2 w-8 h-8 text-safe" />
                    <h4 className="font-bold text-foreground">Digital Financial Compliance Certificate</h4>
                    <p className="text-sm mt-2 text-muted-foreground">
                      Issued to: <strong className="text-foreground">{certName || "Demo User"}</strong>
                    </p>
                    <p className="text-sm text-safe font-medium">Status: Fraud-Free ✓</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
