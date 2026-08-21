"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#FFFAEB] flex flex-col md:flex-row font-sohne overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[#FFFAEB] overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}