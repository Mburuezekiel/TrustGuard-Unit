import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, Radar, Users, Smartphone, Lock, FileText, Upload, Search, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

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

export default function FraudSenseWebsite(): JSX.Element {
  const [lookup, setLookup] = useState<string>("");
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [reportText, setReportText] = useState<string>("");
  const [certName, setCertName] = useState<string>("");
  const [certIssued, setCertIssued] = useState<boolean>(false);

  const sampleDB: SampleDB = {
    "093120": { status: "Safe", color: "green", message: "No fraud reports found. Trusted till." },
    "01234": { status: "Not Safe", color: "red", message: "Linked to reported fraud. Avoid payment." }
  };

  const handleLookup = (): void => {
    if (sampleDB[lookup]) {
      setLookupResult(sampleDB[lookup]);
    } else {
      setLookupResult({ status: "Unknown", color: "yellow", message: "No data found. Proceed with caution." });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 shadow-sm sticky top-0 bg-white z-50">
        <h1 className="text-2xl font-bold">FraudSense</h1>
        <nav className="flex gap-6 text-sm">
          <a href="#report">Report</a>
          <a href="#flag">Flag</a>
          <a href="#certificate">Certificate</a>
          <a href="#download">Download</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-10 px-8 py-16 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Sniff Out Scams Before You Send Money
          </h2>
          <p className="mt-5 text-gray-600 max-w-xl">
            FraudSense sniffs out financial scams, detects scam signals in real time, and warns users before risky payments using intelligence from millions of real user reports.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <p className="text-sm mb-2">Quick Scam Lookup</p>
              <input
                value={lookup}
                onChange={(e) => setLookup(e.target.value)}
                placeholder="Enter till number, paybill, or phone..."
                className="w-full border rounded-xl px-4 py-2"
              />
              <Button onClick={handleLookup} className="mt-3 w-full">Check Risk</Button>
              {lookupResult && (
                <div className={`mt-4 p-4 rounded-xl text-sm bg-${lookupResult.color}-50 text-${lookupResult.color}-700`}>
                  Status: {lookupResult.status} — {lookupResult.message}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Workflow 1: Reporting */}
      <section id="report" className="px-8 py-16 bg-gray-50">
        <h3 className="text-3xl font-bold text-center mb-6">1. Report a Fraud Case</h3>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Copy and paste the payment confirmation message or upload details so FraudSense can learn and protect others.
        </p>
        <Card className="max-w-3xl mx-auto rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Paste the payment message here..."
              className="w-full border rounded-xl p-4 h-32"
            />
            <Button className="mt-4 w-full"><Upload className="mr-2" /> Submit Report</Button>
          </CardContent>
        </Card>
      </section>

      {/* Workflow 2: Flagging */}
      <section id="flag" className="px-8 py-16">
        <h3 className="text-3xl font-bold text-center mb-6">2. Flag a Till, Phone, or PayBill</h3>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Enter a till number, phone number, or PayBill to instantly see if it is safe.
        </p>
        <Card className="max-w-xl mx-auto rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <input
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              placeholder="Try: 093120 (safe) or 01234 (not safe)"
              className="w-full border rounded-xl px-4 py-2"
            />
            <Button onClick={handleLookup} className="mt-3 w-full"><Search className="mr-2" /> Run Risk Check</Button>
            {lookupResult && (
              <div className={`mt-4 p-4 rounded-xl text-sm bg-${lookupResult.color}-50 text-${lookupResult.color}-700`}>
                Status: {lookupResult.status} — {lookupResult.message}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Workflow 3: Certificate Request */}
      <section id="certificate" className="px-8 py-16 bg-gray-50">
        <h3 className="text-3xl font-bold text-center mb-6">3. Request a Digital Compliance Certificate</h3>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Request a certificate to prove you or your business has no recorded financial fraud.
        </p>
        <Card className="max-w-xl mx-auto rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <input
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              placeholder="Enter your name or business name"
              className="w-full border rounded-xl px-4 py-2"
            />
            <Button onClick={() => setCertIssued(true)} className="mt-3 w-full"><BadgeCheck className="mr-2" /> Request Certificate</Button>

            {certIssued && (
              <div className="mt-6 p-5 border rounded-xl bg-white text-center shadow-sm">
                <ShieldCheck className="mx-auto mb-2 text-green-600" />
                <h4 className="font-bold">Digital Financial Compliance Certificate</h4>
                <p className="text-sm mt-2">Issued to: <strong>{certName || "Demo User"}</strong></p>
                <p className="text-sm text-gray-600">Status: Fraud-Free</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Download */}
      <section id="download" className="px-8 py-16 text-center">
        <h3 className="text-3xl font-bold">Demo Ready FraudSense Prototype</h3>
        <p className="text-gray-600 mt-3">Built for live demos of fraud reporting, scam flagging, and compliance verification.</p>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-500">
        © 2026 FraudSense. Demo Prototype.
      </footer>
    </div>
  );
}