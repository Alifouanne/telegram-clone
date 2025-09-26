import HeroSection from "@/components/Mainpage/hero-section";
import { HeroHeader } from "@/components/Mainpage/Header";
import StatsSection from "@/components/Mainpage/Stats";
import Features from "@/components/Mainpage/Features";
import CallToAction from "@/components/Mainpage/CTA";
import FooterSection from "@/components/Mainpage/Footer";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <HeroHeader />

      <main className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ">
        <div className="w-full max-w-7xl mx-auto space-y-16 sm:space-y-20 lg:space-y-24">
          {/* Hero Section */}
          <section className="text-center ">
            <HeroSection />
          </section>

          <section id="social-proof" className="relative">
            {/* Enhanced Divider with animated gradient */}
            <div className="flex w-full items-center justify-center mb-12 sm:mb-16">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border/50" />
              <div className="px-4 sm:px-6">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-primary/20 animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary/60 animate-ping" />
                </div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-border/50" />
            </div>

            <div className="text-center">
              <StatsSection />
            </div>
          </section>

          <section id="features" className="relative">
            {/* Premium Divider with accent color */}
            <div className="flex w-full items-center justify-center mb-12 sm:mb-16">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-primary/40" />
              <div className="px-4 sm:px-6">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/30 animate-pulse" />
                </div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/20 to-primary/40" />
            </div>

            {/* Features Grid Container - Mobile first, then desktop grid */}
            <div className="w-full">
              <Features />
            </div>
          </section>

          <section className="relative">
            <div className="flex w-full items-center justify-center mb-12 sm:mb-16">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-accent/50" />
              <div className="px-4 sm:px-6">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-primary" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-accent/20 animate-pulse" />
                </div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/30 to-accent/50" />
            </div>

            {/* CTA Section */}
            <div id="cta" className="text-center">
              <CallToAction />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
