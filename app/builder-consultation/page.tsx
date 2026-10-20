"use client";

import { useState } from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import {
  Filter,
  Users,
  TrendingUp,
  Building2,
  Target,
  Megaphone,
  UserCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  Phone,
  FileText,
  MessageSquare,
  Compass,
  Lock,
  ChevronRight,
} from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-playfair",
});

interface ConsultationFormData {
  fullName: string;
  phone: string;
  companyName: string;
  projectLocation: string;
  projectStage: string;
  mainChallenge: string;
}

export default function BuilderConsultationPage() {
  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: "",
    phone: "",
    companyName: "",
    projectLocation: "",
    projectStage: "",
    mainChallenge: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const scrollToForm = () => {
    const el = document.getElementById("consultation-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const phoneNumber = "919727027052";
    const message =
      `*New Builder Consultation Request*%0A%0A` +
      `*Full Name:* ${encodeURIComponent(formData.fullName)}%0A` +
      `*Phone / WhatsApp:* ${encodeURIComponent(formData.phone)}%0A` +
      `*Builder / Company:* ${encodeURIComponent(formData.companyName)}%0A` +
      `*Project Location:* ${encodeURIComponent(formData.projectLocation)}%0A` +
      `*Current Project Stage:* ${encodeURIComponent(formData.projectStage || "Not Specified")}%0A` +
      `*Main Challenge:* ${encodeURIComponent(formData.mainChallenge || "Not Specified")}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.open(whatsappUrl, "_blank");
    }, 400);
  };

  return (
    <main
      className={`min-h-screen bg-[#FDFBF7] text-[#1E293B] ${playfair.variable} font-sans selection:bg-[#E8AA38] selection:text-white`}
    >
      {/* ========================================================
          SECTION 1: HERO (Dark Navy, Golden Accent, Sudhir Prajapati)
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#020B14] via-[#05172C] to-[#08223F] text-white pt-8 pb-14 md:pt-14 md:pb-20 border-b border-[#0d2238]">
        {/* Subtle background ambient gradients */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#1a4470] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#E8AA38]/15 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
          {/* Top Tagline / Eyebrow */}
          <div className="flex items-center justify-center md:justify-start mb-6 md:mb-8">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-white/70 border-b border-white/15 pb-2">
              REAL ESTATE CONSULTANT{" "}
              <span className="text-[#E8AA38] mx-2 font-bold">|</span> EDUCATOR{" "}
              <span className="text-[#E8AA38] mx-2 font-bold">|</span> AHMEDABAD &amp;
              GANDHINAGAR
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center md:text-left space-y-6">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.16]">
                <span className="text-white block">Builder Bhai,</span>
                <span className="text-[#E8AA38] block mt-1">
                  Let’s Build More Than Buildings.
                </span>
                <span className="text-white block mt-1">
                  Let’s Build a Stronger Real Estate Business.
                </span>
              </h1>

              <p className="text-white/80 text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed">
                Get expert guidance on project positioning, marketing strategy,
                lead generation, site visits, and sales conversion.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <button
                  onClick={scrollToForm}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-slate-950 font-bold text-sm md:text-base uppercase tracking-wider bg-gradient-to-r from-[#F9C354] via-[#F1B33B] to-[#D89423] hover:from-[#fcd37a] hover:to-[#e59d28] shadow-lg shadow-[#E8AA38]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>BOOK A CONSULTATION</span>
                  <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                </button>

                <a
                  href="tel:+919727027052"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-white/90 border border-white/20 hover:bg-white/10 text-sm font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#E8AA38]" />
                  <span>+91 97270 27052</span>
                </a>
              </div>
            </div>

            {/* Right Column: Hero Visual with Bhai's Photo, Crane & Badge */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#E8AA38]/30 via-transparent to-transparent blur-xl opacity-60 group-hover:opacity-80 transition duration-500" />

                <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-[#07192b] shadow-2xl">
                  <Image
                    src="/images/sudhir-hero-final.jpg"
                    alt="Sudhir Prajapati - Veer Real Estate - Builder Bhai"
                    width={700}
                    height={560}
                    priority
                    className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: THE REAL CHALLENGES (Off-white / Warm Cream Cards)
          ======================================================== */}
      <section className="relative py-14 md:py-20 bg-[#FDFBF7] border-b border-[#EAE3D2] overflow-hidden">
        {/* Subtle decorative architectural background */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-15 pointer-events-none hidden xl:block">
          <Image
            src="/images/builder-challenge-skyline.jpg"
            alt="Real estate developments"
            fill
            className="object-cover object-left"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B87A18] block mb-2">
                THE REAL CHALLENGES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] leading-tight">
                Your Project Is Ready,
                <br />
                Is Your Sales Strategy?
              </h2>
            </div>
            <div className="md:max-w-md">
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Many builders and developers face similar challenges.
                <br className="hidden sm:inline" /> Do any of these sound familiar?
              </p>
            </div>
          </div>

          {/* 4 Cards Grid - Matching warm luxury cards in flyer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="bg-[#FFFDF9] rounded-2xl p-6 border border-[#F3DFC1] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5B638] to-[#D4952A] shadow-md shadow-[#E8AA38]/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Filter className="w-5 h-5 text-slate-950 stroke-[2.2]" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-base md:text-lg mb-2">
                  Quality Leads
                  <span className="block text-slate-500 font-normal text-sm mt-0.5">
                    but Fewer Site Visits
                  </span>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mt-3">
                  Leads are coming, but not converting into site visits.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FFFDF9] rounded-2xl p-6 border border-[#F3DFC1] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5B638] to-[#D4952A] shadow-md shadow-[#E8AA38]/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 text-slate-950 stroke-[2.2]" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-base md:text-lg mb-2">
                  Site Visits
                  <span className="block text-slate-500 font-normal text-sm mt-0.5">
                    but Low Conversions
                  </span>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mt-3">
                  People visit the site but bookings are not happening.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FFFDF9] rounded-2xl p-6 border border-[#F3DFC1] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5B638] to-[#D4952A] shadow-md shadow-[#E8AA38]/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-5 h-5 text-slate-950 stroke-[2.2]" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-base md:text-lg mb-2">
                  Hard to Differentiate
                  <span className="block text-slate-500 font-normal text-sm mt-0.5">
                    the Project
                  </span>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mt-3">
                  Project looks similar to many other options in the market.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FFFDF9] rounded-2xl p-6 border border-[#F3DFC1] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5B638] to-[#D4952A] shadow-md shadow-[#E8AA38]/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5 text-slate-950 stroke-[2.2]" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-base md:text-lg mb-2">
                  Unsold Inventory
                  <span className="block text-slate-500 font-normal text-sm mt-0.5">
                    &amp; Inconsistent Sales
                  </span>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mt-3">
                  Inventory is unsold and follow-ups are not consistent.
                </p>
              </div>
            </div>
          </div>

          {/* Right Bottom Highlight Note */}
          <div className="mt-8 pt-6 border-t border-[#EAE3D2] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-700 text-sm md:text-base font-medium text-center sm:text-left">
              <strong className="text-[#0F172A]">Every project has different challenges.</strong>{" "}
              The right strategy starts by identifying yours.
            </p>
            <button
              onClick={scrollToForm}
              className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#B87A18] hover:text-[#915f0f] inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Identify Your Project Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: HOW I CAN HELP (Deep Midnight Navy with 4 Columns)
          ======================================================== */}
      <section className="bg-[#051628] text-white py-14 md:py-20 border-b border-[#0f243b]">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8AA38] block mb-2">
              HOW I CAN HELP
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold leading-tight text-white">
              Let’s Identify What’s
              <br />
              Holding Your Project Back.
            </h2>
          </div>

          {/* 4 Strategic Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-white/10">
            {/* Pillar 1 */}
            <div className="pt-6 sm:pt-0 lg:pr-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8AA38] mb-4">
                <Target className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-bold text-lg text-white">
                Project Positioning
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Define your target buyers, project differentiators, and market
                positioning.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="pt-6 sm:pt-0 lg:px-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8AA38] mb-4">
                <Megaphone className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-bold text-lg text-white">
                Marketing Strategy
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Identify opportunities to improve campaign messaging and lead
                quality.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="pt-6 sm:pt-0 lg:px-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8AA38] mb-4">
                <UserCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-bold text-lg text-white">
                Site Visits &amp; Conversion
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Review the buyer journey, follow-up process, and booking
                barriers.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="pt-6 sm:pt-0 lg:pl-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8AA38] mb-4">
                <TrendingUp className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-bold text-lg text-white">
                Sales Growth Planning
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Practical next steps based on your project&apos;s current stage and
                challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: 2-COLUMN MAIN SECTION (ABOUT ME + FORM)
          ======================================================== */}
      <section className="py-14 md:py-20 bg-[#F7F5F0]">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left 7 Columns: ABOUT ME + STATS + HOW IT WORKS */}
            <div className="lg:col-span-7 space-y-8">
              {/* Card 1: ABOUT ME */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D2] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B87A18] block mb-2">
                  ABOUT ME
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A] leading-tight mb-6">
                  Real Estate Understanding.
                  <br />
                  Practical Business Guidance.
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  {/* Photo of Sudhir Prajapati */}
                  <div className="sm:col-span-5 flex justify-center sm:justify-start">
                    <div className="relative w-44 sm:w-full max-w-[200px] aspect-[4/5] rounded-2xl overflow-hidden border border-[#E8AA38]/40 shadow-md">
                      <Image
                        src="/images/sudhir-about-final.jpg"
                        alt="Sudhir Prajapati - Real Estate Consultant"
                        fill
                        className="object-cover object-top hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Bio Description */}
                  <div className="sm:col-span-7 space-y-4">
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                      With <strong className="text-[#0F172A] font-semibold">15+ years</strong> of
                      experience in Ahmedabad &amp; Gandhinagar real estate, I
                      have worked with builders, developers, investors and home
                      buyers.
                    </p>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                      My focus is on providing practical guidance and helping real
                      estate stakeholders make informed decisions.
                    </p>
                  </div>
                </div>

                {/* 3 Metric Stats */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 pt-6 border-t border-[#EAE3D2] text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                    <Star className="w-6 h-6 text-[#E8AA38] fill-[#E8AA38] shrink-0" />
                    <div>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A] block leading-none">
                        15+
                      </span>
                      <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                        Years of Experience
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                    <Users className="w-6 h-6 text-[#E8AA38] shrink-0" />
                    <div>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A] block leading-none">
                        2,000+
                      </span>
                      <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                        Customers Served
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                    <Building2 className="w-6 h-6 text-[#E8AA38] shrink-0" />
                    <div>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A] block leading-none">
                        40+
                      </span>
                      <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                        Team Members
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: HOW IT WORKS */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D2] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B87A18] block mb-2">
                  HOW IT WORKS
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0F172A] leading-tight mb-6">
                  A Simple Process. A Clearer Direction.
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-start">
                  {/* Step 1 */}
                  <div className="space-y-3 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        1
                      </div>
                      <FileText className="w-5 h-5 text-[#D4952A]" />
                    </div>
                    <h4 className="font-bold text-[#0F172A] text-sm md:text-base">
                      Share Your Project Details
                    </h4>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                      Tell us about your development and current challenge.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-3 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        2
                      </div>
                      <MessageSquare className="w-5 h-5 text-[#D4952A]" />
                    </div>
                    <h4 className="font-bold text-[#0F172A] text-sm md:text-base">
                      Discuss Your Priorities
                    </h4>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                      Understand the issues around positioning, marketing or sales.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-3 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        3
                      </div>
                      <Compass className="w-5 h-5 text-[#D4952A]" />
                    </div>
                    <h4 className="font-bold text-[#0F172A] text-sm md:text-base">
                      Explore the Next Steps
                    </h4>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                      Discuss relevant strategies and whether consulting is the
                      right fit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: LEAD CONSULTATION FORM */}
            <div id="consultation-form" className="lg:col-span-5 scroll-mt-24">
              <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border-2 border-[#E8AA38]/40 shadow-xl shadow-[#E8AA38]/10 relative overflow-hidden">
                {/* Gold accent top bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#F9C354] via-[#E8AA38] to-[#D89423]" />

                <div className="mb-6 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B87A18] block mb-1">
                    GET STARTED
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A]">
                    Book a Builder Consultation
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                    Share a few details about your project. Our team will
                    connect with you to discuss the next steps.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-serif text-xl font-bold text-[#0F172A]">
                      Consultation Request Sent!
                    </h4>
                    <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                      Thank you, <strong>{formData.fullName}</strong>. Your project
                      details have been shared directly with Sudhir Prajapati and
                      the Veer Real Estate team.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-xs font-semibold text-[#B87A18] hover:underline cursor-pointer"
                      >
                        Submit another inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D9C7] focus:border-[#E8AA38] focus:ring-2 focus:ring-[#E8AA38]/20 text-sm outline-none transition-all placeholder:text-slate-400 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D9C7] focus:border-[#E8AA38] focus:ring-2 focus:ring-[#E8AA38]/20 text-sm outline-none transition-all placeholder:text-slate-400 bg-white"
                        />
                      </div>
                    </div>

                    {/* Row 2: Builder / Company */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Builder / Developer Company{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Company name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D9C7] focus:border-[#E8AA38] focus:ring-2 focus:ring-[#E8AA38]/20 text-sm outline-none transition-all placeholder:text-slate-400 bg-white"
                      />
                    </div>

                    {/* Row 3: Project Location */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Project Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="projectLocation"
                        required
                        value={formData.projectLocation}
                        onChange={handleChange}
                        placeholder="City or area"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D9C7] focus:border-[#E8AA38] focus:ring-2 focus:ring-[#E8AA38]/20 text-sm outline-none transition-all placeholder:text-slate-400 bg-white"
                      />
                    </div>

                    {/* Row 4: Stage & Challenge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Current Project Stage{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="projectStage"
                          required
                          value={formData.projectStage}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D9C7] focus:border-[#E8AA38] focus:ring-2 focus:ring-[#E8AA38]/20 text-sm outline-none transition-all bg-white text-slate-700 cursor-pointer"
                        >
                          <option value="">Select stage</option>
                          <option value="Planning & Permissions">Planning &amp; Permissions</option>
                          <option value="Under Construction (Early Phase)">Under Construction (Early Phase)</option>
                          <option value="Mid Construction / Structure Ready">Mid Construction / Structure Ready</option>
                          <option value="Near Completion / Sample House Ready">Near Completion / Sample House Ready</option>
                          <option value="Ready for Possession">Ready for Possession</option>
                          <option value="Completed with Unsold Units">Completed with Unsold Units</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Main Challenge <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="mainChallenge"
                          required
                          value={formData.mainChallenge}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D9C7] focus:border-[#E8AA38] focus:ring-2 focus:ring-[#E8AA38]/20 text-sm outline-none transition-all bg-white text-slate-700 cursor-pointer"
                        >
                          <option value="">Select challenge</option>
                          <option value="Quality Leads but Fewer Site Visits">Quality Leads but Fewer Site Visits</option>
                          <option value="Site Visits but Low Conversions">Site Visits but Low Conversions</option>
                          <option value="Hard to Differentiate the Project">Hard to Differentiate the Project</option>
                          <option value="Unsold Inventory & Inconsistent Sales">Unsold Inventory &amp; Inconsistent Sales</option>
                          <option value="Project Positioning & Pricing Strategy">Project Positioning &amp; Pricing Strategy</option>
                          <option value="Marketing Strategy & Launch Plan">Marketing Strategy &amp; Launch Plan</option>
                          <option value="Other Business Challenge">Other Business Challenge</option>
                        </select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 rounded-xl text-slate-950 font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-[#F9C354] via-[#F1B33B] to-[#D89423] hover:from-[#fcd37a] hover:to-[#e59d28] shadow-lg shadow-[#E8AA38]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span>Connecting...</span>
                        ) : (
                          <>
                            <span>REQUEST A CONSULTATION</span>
                            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Confidentiality Notice */}
                    <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-500 text-center">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Your details will be kept confidential and used only for
                        consultation purposes.
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: BOTTOM CALL-TO-ACTION BANNER
          ======================================================== */}
      <section className="relative overflow-hidden bg-[#03101E] text-white py-12 md:py-16 border-t border-white/10">
        {/* Right Skyline Background Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-25 lg:opacity-40 pointer-events-none">
          <Image
            src="/images/builder-bottom-skyline-clean.jpg"
            alt="Skyline"
            fill
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03101E] via-[#03101E]/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8AA38] block">
                LET&apos;S BUILD TOGETHER
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Your Next Project Deserves a Clear Strategy.
              </h2>
              <p className="text-white/75 text-sm md:text-base leading-relaxed">
                Connect with Sudhir Prajapati to discuss your project, current
                challenges, and potential growth opportunities.
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-auto text-center">
              <button
                onClick={scrollToForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-slate-950 font-bold text-sm md:text-base uppercase tracking-wider bg-gradient-to-r from-[#F9C354] via-[#F1B33B] to-[#D89423] hover:from-[#fcd37a] hover:to-[#e59d28] shadow-lg shadow-[#E8AA38]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>LET&apos;S DISCUSS YOUR PROJECT</span>
                <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
