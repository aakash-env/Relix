"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Check } from "lucide-react";

export default function ProfileSettingsPage() {
  const [firstName, setFirstName] = useState("Alice");
  const [lastName, setLastName] = useState("Chen");
  const [email, setEmail] = useState("alice@example.com");
  const [displayName, setDisplayName] = useState("alice.chen");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem("relix_user_email");
      const storedName = localStorage.getItem("relix_user_name");
      if (storedEmail) setEmail(storedEmail);
      if (storedName) {
        const parts = storedName.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
        setDisplayName(storedName.toLowerCase().replace(/\s+/g, "."));
      }
    } catch {}
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const fullName = `${firstName} ${lastName}`.trim();
    try {
      localStorage.setItem("relix_user_name", fullName);
      localStorage.setItem("relix_user_email", email);
    } catch {}

    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initial = firstName ? firstName.charAt(0).toUpperCase() : "U";

  return (
    <div className="p-6 md:p-8 max-w-[720px] mx-auto font-sohne">
      <h1 className="text-2xl font-semibold text-[#1c1a18] mb-1">Profile</h1>
      <p className="text-sm text-[#6b6460] mb-8">Update your personal information.</p>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#00674F] flex items-center justify-center text-2xl font-bold text-white shadow-xs">
              {initial}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-[#c8c0b4] flex items-center justify-center text-[#6b6460] hover:bg-[#f4f0e8] transition-colors"
              aria-label="Change avatar"
              title="Avatar upload"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1c1a18]">{`${firstName} ${lastName}`.trim()}</p>
            <p className="text-xs text-[#6b6460]">{email}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="rounded-xl border border-[#e8e4dc] bg-white p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-[#1c1a18]">Basic information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="profile-first-name"
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              id="profile-last-name"
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Input
            id="profile-email"
            name="email"
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="profile-display-name"
            label="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            hint="Used in team workspaces."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" loading={saving} id="profile-save">
            {saving ? "Saving…" : "Save changes"}
          </Button>
          {saved && (
            <p className="text-sm text-[#00674F] flex items-center gap-1.5 font-medium" role="status">
              <Check className="h-4 w-4" />
              <span>Changes saved successfully!</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}