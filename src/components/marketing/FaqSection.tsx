"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Does my DDL schema get uploaded to an external server?",
    a: "No. Relix parses your SQL DDL schema and generates synthetic seed data 100% locally inside your browser runtime. No database credentials or schema definitions are ever sent over the network.",
  },
  {
    q: "How does Relix handle foreign key constraints and cycles?",
    a: "Relix runs Kahn's topological sort algorithm to construct a Directed Acyclic Graph (DAG) of your database schema. Parent tables are populated first, and their primary keys are pooled and referenced during child table generation. Circular dependencies trigger immediate line-level warnings.",
  },
  {
    q: "Which ORMs and export formats are supported?",
    a: "Relix exports ready-to-run TypeScript seed scripts for Drizzle ORM (db.insert().values()), Prisma (prisma.model.createMany()), raw SQL INSERT transactions, JSON (with metadata envelope), and multi-table CSV files.",
  },
  {
    q: "What does deterministic seeding mean for my team?",
    a: "By providing an integer seed (e.g. seed = 42), the Mulberry32 pseudo-random number generator produces the exact same records, UUIDs, dates, and relationships on every run. This eliminates flaky integration tests in CI/CD pipelines.",
  },
  {
    q: "Can I customize the number of generated records per table?",
    a: "Yes. In the generator controls, you can adjust per-table sliders (from 1 to 50,000+ records), toggle individual entities on or off, select date horizons, and pick geographical locales.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIdx(openIdx === i ? null : i);
  };

  return (
    <section className="py-20 md:py-28 bg-[#FFFAEB] border-t border-[#EAE3D2]" id="faq" aria-labelledby="faq-title">
      <div className="max-w-[860px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="faq-title"
            className="font-meraki text-3xl md:text-5xl font-light text-[#1B1C15] leading-tight tracking-tight"
          >
            Frequently asked questions
          </h2>
        </div>

        {/* Clean Accordion Rows */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border border-[#EAE3D2] transition-all duration-200 ${
                  isOpen ? "bg-white shadow-card-sm" : "bg-white/60 hover:bg-white"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-medium text-[#1B1C15] hover:text-[#00674F] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm md:text-base font-semibold pr-4 font-sohne">{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#FFFAEB] border border-[#EAE3D2] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-45 bg-[#E6F4EF] text-[#00674F] border-[#D0ECE2]" : "text-[#828579]"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs md:text-sm text-[#5E6156] leading-relaxed border-t border-[#F3EDE0] pt-4 font-sohne">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}