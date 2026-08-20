import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock, Cpu, ServerOff } from "lucide-react";

const securityFeatures = [
  {
    icon: <Cpu className="h-6 w-6 text-[#00674F]" />,
    title: "100% Client-Side Engine",
    description:
      "All DDL parsing, foreign key graph analysis, and synthetic record generation run locally in your browser engine. Zero schema definitions are uploaded.",
  },
  {
    icon: <ServerOff className="h-6 w-6 text-[#00674F]" />,
    title: "Zero Database Credentials Needed",
    description:
      "Relix never asks for your live database connection strings, passwords, or cloud credentials. It outputs standalone TypeScript & SQL scripts.",
  },
  {
    icon: <Lock className="h-6 w-6 text-[#00674F]" />,
    title: "Deterministic & Isolated",
    description:
      "Mulberry32 PRNG math generates synthetic records from scratch. No production data is accessed, retained, or leaked across environments.",
  },
];

export function SecuritySection() {
  return (
    <section className="py-14 md:py-20 bg-[#FFFAEB] border-t border-[#EAE3D2]" id="security" aria-labelledby="sec-title">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[660px] mx-auto mb-12 md:mb-16">
          <h2
            id="sec-title"
            className="font-meraki text-3xl md:text-5xl font-light text-[#1B1C15] leading-tight tracking-tight mb-4"
          >
            Your database with
            <br />
            <span className="font-normal text-[#00674F]">enterprise-grade privacy.</span>
          </h2>
          <p className="text-base text-[#5E6156] leading-relaxed font-sohne">
            Designed for privacy-conscious engineers and teams. Complete local isolation, zero database credential exposure.
          </p>
        </div>

        {/* 3 Restrained Security Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {securityFeatures.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[#EAE3D2] bg-white p-8 shadow-card-sm hover:shadow-card-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E6F4EF] flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="font-meraki text-xl font-medium text-[#1B1C15] mb-3">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-[#5E6156] leading-relaxed font-sohne">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Learn more link */}
        <div className="text-center">
          <Link
            href="/docs#security"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00674F] hover:underline"
          >
            Learn more about our privacy model <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}