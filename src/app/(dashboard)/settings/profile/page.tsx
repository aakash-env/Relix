"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";

export default function ProfileSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-[720px] mx-auto">
      <h1 className="text-2xl font-semibold text-[#1c1a18] mb-1">Profile</h1>
      <p className="text-sm text-[#6b6460] mb-8">Update your personal information.</p>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#6366f1] flex items-center justify-center text-2xl font-bold text-white">
              A
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-[#c8c0b4] flex items-center justify-center text-[#6b6460] hover:bg-[#f4f0e8] transition-colors"
              aria-label="Change avatar"
              title="Avatar upload coming soon"
              disabled
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1c1a18]">Alice Chen</p>
            <p className="text-xs text-[#6b6460]">alice@example.com</p>
            <button type="button" className="text-xs text-[#6366f1] hover:underline mt-0.5" disabled>
              Upload avatar (coming soon)
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="rounded-xl border border-[#e8e4dc] bg-white p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-[#1c1a18]">Basic information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input id="profile-first-name" label="First name" defaultValue="Alice" />
            <Input id="profile-last-name" label="Last name" defaultValue="Chen" />
          </div>
          <Input id="profile-email" name="email" type="email" label="Email address" defaultValue="alice@example.com" hint="Email changes require verification." />
          <Input id="profile-display-name" label="Display name" defaultValue="alice.chen" hint="Used in team workspaces." />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" loading={saving} id="profile-save">
            {saving ? "Saving…" : "Save changes"}
          </Button>
          {saved && (
            <p className="text-sm text-[#4a7c59]" role="status">Changes saved!</p>
          )}
        </div>
      </form>

      {/* Danger zone */}
      <div className="mt-12 rounded-xl border border-red-100 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800 mb-1">Danger zone</h2>
        <p className="text-sm text-red-700 mb-4">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <Button variant="destructive" size="sm" disabled id="profile-delete-account" title="Account deletion — contact support">
          Delete account
        </Button>
      </div>
    </div>
  );
}
