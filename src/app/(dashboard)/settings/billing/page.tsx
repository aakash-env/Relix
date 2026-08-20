"use client";

import React, { useState } from "react";
import { Check, Zap, CreditCard, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BillingSettingsPage() {
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | "team">("free");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [upgrading, setUpgrading] = useState(false);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  const handleUpgrade = async (plan: "pro" | "team") => {
    setUpgrading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setUpgrading(false);
    setCurrentPlan(plan);
    setSuccessNote(`Successfully switched to the ${plan.toUpperCase()} plan! (Demo checkout simulation)`);
    setTimeout(() => setSuccessNote(null), 5000);
  };

  return (
    <div className="p-6 md:p-8 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1a18] mb-1">Billing & Subscription</h1>
          <p className="text-sm text-[#6b6460]">Manage your subscription tier, limits, and payment methods.</p>
        </div>
      </div>

      {successNote && (
        <div role="status" className="p-4 rounded-xl mb-6 bg-[#eef3ec] text-[#2c4f38] border border-[#d4e5d0] text-sm">
          {successNote}
        </div>
      )}

      {/* Current Subscription Card */}
      <div className="rounded-xl border border-[#e8e4dc] bg-white p-6 mb-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-[#1c1a18] capitalize">{currentPlan} Plan</h2>
              <Badge variant={currentPlan === "free" ? "secondary" : "default"}>
                {currentPlan === "free" ? "Active (Free Tier)" : "Active (Paid Subscription)"}
              </Badge>
            </div>
            <p className="text-sm text-[#6b6460]">
              {currentPlan === "free"
                ? "3 total projects · 500 records per export · Client-side generation"
                : "Unlimited projects · 50,000 records per export · Custom presets & API access"}
            </p>
          </div>
          {currentPlan === "free" ? (
            <Button size="sm" onClick={() => handleUpgrade("pro")} loading={upgrading} id="billing-upgrade-now">
              <Zap className="h-4 w-4" /> Upgrade to Pro
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setCurrentPlan("free")} id="billing-cancel-sub">
              Cancel Subscription
            </Button>
          )}
        </div>

        {/* Usage bar */}
        <div className="mt-6 pt-6 border-t border-[#f4f0e8]">
          <div className="flex items-center justify-between text-xs text-[#6b6460] mb-2">
            <span>Monthly Generation Quota</span>
            <span className="font-medium text-[#1c1a18]">
              {currentPlan === "free" ? "3 / 10 generations" : "48 / Unlimited"}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#f4f0e8] overflow-hidden">
            <div
              className="h-full bg-[#6366f1] rounded-full transition-all duration-500"
              style={{ width: currentPlan === "free" ? "30%" : "12%" }}
            />
          </div>
        </div>
      </div>

      {/* Plan selection grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1c1a18]">Available Plans</h2>
          <div className="inline-flex items-center rounded-lg border border-[#c8c0b4] bg-[#f4f0e8] p-0.5 gap-1 text-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                billingCycle === "monthly" ? "bg-white text-[#1c1a18] shadow-xs" : "text-[#6b6460]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                billingCycle === "annual" ? "bg-white text-[#1c1a18] shadow-xs" : "text-[#6b6460]"
              }`}
            >
              Annual (20% off)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Free */}
          <div className="rounded-xl border border-[#e8e4dc] bg-white p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-[#1c1a18]">Free</h3>
              <p className="text-2xl font-semibold text-[#1c1a18] my-2">$0</p>
              <p className="text-xs text-[#6b6460] mb-4">For individual developers trying out Relix.</p>
              <ul className="flex flex-col gap-2 text-xs text-[#3d3a36]">
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4a7c59]" /> 3 projects</li>
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4a7c59]" /> 500 records / run</li>
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4a7c59]" /> AI SaaS preset</li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-6"
              disabled={currentPlan === "free"}
              onClick={() => setCurrentPlan("free")}
            >
              {currentPlan === "free" ? "Current plan" : "Downgrade"}
            </Button>
          </div>

          {/* Pro */}
          <div className="rounded-xl border-2 border-[#6366f1] bg-[#1c1a18] text-white p-5 flex flex-col justify-between relative shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-[#6366f1] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Popular
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Pro</h3>
              <p className="text-2xl font-semibold text-white my-2">
                ${billingCycle === "annual" ? "23" : "29"}
                <span className="text-xs text-white/50 font-normal"> / mo</span>
              </p>
              <p className="text-xs text-white/60 mb-4">For power users and independent founders.</p>
              <ul className="flex flex-col gap-2 text-xs text-white/80">
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#c3e88d]" /> Unlimited projects</li>
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#c3e88d]" /> 50,000 records / run</li>
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#c3e88d]" /> All export formats</li>
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#c3e88d]" /> REST API access</li>
              </ul>
            </div>
            <Button
              size="sm"
              className="w-full mt-6 bg-[#6366f1] hover:bg-[#4f46e5]"
              disabled={currentPlan === "pro"}
              onClick={() => handleUpgrade("pro")}
              loading={upgrading && currentPlan !== "pro"}
            >
              {currentPlan === "pro" ? "Current plan" : "Upgrade to Pro"}
            </Button>
          </div>

          {/* Team */}
          <div className="rounded-xl border border-[#e8e4dc] bg-white p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-[#1c1a18]">Team</h3>
              <p className="text-2xl font-semibold text-[#1c1a18] my-2">
                ${billingCycle === "annual" ? "63" : "79"}
                <span className="text-xs text-[#6b6460] font-normal"> / mo</span>
              </p>
              <p className="text-xs text-[#6b6460] mb-4">For engineering teams sharing schemas.</p>
              <ul className="flex flex-col gap-2 text-xs text-[#3d3a36]">
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4a7c59]" /> Everything in Pro</li>
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4a7c59]" /> 10 team seats</li>
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4a7c59]" /> Shared seed fixtures</li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-6"
              disabled={currentPlan === "team"}
              onClick={() => handleUpgrade("team")}
              loading={upgrading && currentPlan !== "team"}
            >
              {currentPlan === "team" ? "Current plan" : "Upgrade to Team"}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment methods & Invoices */}
      <div className="rounded-xl border border-[#e8e4dc] bg-white p-6">
        <h2 className="font-semibold text-[#1c1a18] mb-4">Payment Methods</h2>
        <div className="flex items-center justify-between p-4 rounded-lg bg-[#faf8f4] border border-[#e8e4dc]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#c8c0b4] flex items-center justify-center text-[#6b6460]">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1c1a18]">Visa ending in 4242</p>
              <p className="text-xs text-[#6b6460]">Expires 12/28</p>
            </div>
          </div>
          <Badge variant="outline">Default</Badge>
        </div>
      </div>
    </div>
  );
}
