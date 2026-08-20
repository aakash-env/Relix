import React from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Relix completely replaced the 400 lines of brittle manual SQL seed fixtures we used to maintain. It resolved all 14 foreign keys without a single runtime error.",
    name: "Alex Rivera",
    role: "Principal Architect @ NeonScale",
    avatar: "AR",
    bg: "bg-[#00674F]",
  },
  {
    quote:
      "Having realistic LLM conversation histories with token counts and pricing out of the box let us demo our AI analytics app to investors 3 weeks early.",
    name: "Elena Rostova",
    role: "Founder & CTO @ Novatech AI",
    avatar: "ER",
    bg: "bg-[#1B1C15]",
  },
  {
    quote:
      "Deterministic seed values mean every engineer on our team sees the exact same bug reproduction state in CI. No more 'works on my machine' database issues.",
    name: "Marcus Vance",
    role: "Lead Backend Engineer @ PulseOps",
    avatar: "MV",
    bg: "bg-[#3D3A36]",
  },
  {
    quote:
      "Exporting directly to TypeScript Drizzle ORM insert statements saved us days of boilerplate. It even respects parent table topological order.",
    name: "Kenji Sato",
    role: "Senior Full-Stack Engineer @ Tokyo Labs",
    avatar: "KS",
    bg: "bg-[#00674F]",
  },
  {
    quote:
      "The client-side privacy model was the deciding factor for our security team. Our proprietary DDL schema never touches external servers.",
    name: "Sarah Jenkins",
    role: "VP of Engineering @ CloudFlow",
    avatar: "SJ",
    bg: "bg-[#1B1C15]",
  },
  {
    quote:
      "Fastest seed generator I've ever used. 1,000+ relational records across 12 tables generated in literally 250 milliseconds.",
    name: "David Kim",
    role: "Staff Infrastructure Engineer @ ScaleFlow",
    avatar: "DK",
    bg: "bg-[#3D3A36]",
  },
];

export function SocialProofSection() {
  return (
    <section className="py-20 md:py-28 bg-[#FFFAEB] border-t border-[#EAE3D2]" aria-labelledby="proof-heading">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-[620px] mx-auto mb-12 md:mb-16">
          <h2
            id="proof-heading"
            className="font-meraki text-3xl md:text-5xl font-light text-[#1B1C15] leading-tight tracking-tight"
          >
            From developers who use Relix
            <br />
            <span className="font-normal text-[#00674F]">every single day.</span>
          </h2>
        </div>

        {/* 6 Quiet Paper Panels on Ivory Background */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-3xl border border-[#EAE3D2] bg-white p-7 flex flex-col justify-between shadow-card-sm hover:shadow-card-md hover:border-[#D4CDBC] transition-all duration-300"
            >
              <div className="mb-6">
                <Quote className="h-4 w-4 text-[#00674F]/30 mb-3" />
                <p className="text-xs md:text-sm text-[#3D3A36] leading-relaxed italic font-sohne">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#F3EDE0]">
                <div
                  className={`w-8 h-8 rounded-full ${t.bg} text-[#FFFAEB] flex items-center justify-center font-bold text-xs shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1B1C15] font-sohne">{t.name}</p>
                  <p className="text-[0.65rem] text-[#828579] font-sohne">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}