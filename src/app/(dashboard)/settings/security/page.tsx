"use client";

import React, { useState } from "react";
import { Shield, KeyRound, Smartphone, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setStatusMessage({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (newPassword.length < 8) {
      setStatusMessage({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setStatusMessage({ type: "success", text: "Password successfully updated." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="p-6 md:p-8 max-w-[720px] mx-auto">
      <h1 className="text-2xl font-semibold text-[#1c1a18] mb-1">Security</h1>
      <p className="text-sm text-[#6b6460] mb-8">Manage your authentication and account security.</p>

      {statusMessage && (
        <div
          role="status"
          className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-2 border ${
            statusMessage.type === "success"
              ? "bg-[#eef3ec] text-[#2c4f38] border-[#d4e5d0]"
              : "bg-red-50 text-red-700 border-red-100"
          }`}
        >
          {statusMessage.type === "success" && <CheckCircle2 className="h-4 w-4 text-[#4a7c59]" />}
          {statusMessage.text}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Change password card */}
        <form onSubmit={handlePasswordChange} className="rounded-xl border border-[#e8e4dc] bg-white p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-[#6b6460]" />
            <h2 className="font-semibold text-[#1c1a18]">Change password</h2>
          </div>

          <Input
            id="current-password"
            type="password"
            label="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••••••"
            required
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="new-password"
              type="password"
              label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
            <Input
              id="confirm-new-password"
              type="password"
              label="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              required
            />
          </div>

          <Button type="submit" loading={saving} className="self-start mt-2" id="security-update-password">
            {saving ? "Updating…" : "Update password"}
          </Button>
        </form>

        {/* Two-Factor Authentication */}
        <div className="rounded-xl border border-[#e8e4dc] bg-white p-6 flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#eef3ec] flex items-center justify-center text-[#4a7c59] shrink-0">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#1c1a18]">Two-factor authentication</h3>
                <Badge variant="secondary">Disabled</Badge>
              </div>
              <p className="text-sm text-[#6b6460] mt-1 leading-relaxed">
                Add an extra layer of security using an authenticator app (Google Authenticator, 1Password, etc.).
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" disabled title="2FA setup coming soon" id="security-enable-2fa">
            Enable 2FA
          </Button>
        </div>

        {/* Active sessions */}
        <div className="rounded-xl border border-[#e8e4dc] bg-white p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#1c1a18]">Active sessions</h3>
              <p className="text-xs text-[#6b6460] mt-0.5">Devices currently signed into your Relix account.</p>
            </div>
            <Badge variant="success">1 active</Badge>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#faf8f4] border border-[#e8e4dc]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
              <div>
                <p className="text-sm font-medium text-[#1c1a18]">Current Session (Windows / Chrome)</p>
                <p className="text-xs text-[#6b6460]">Active right now · Local machine</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
