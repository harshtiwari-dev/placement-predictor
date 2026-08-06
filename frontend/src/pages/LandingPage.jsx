import LandingNavbar from "../components/Navbar/LandingNavbar";
import Hero from "../components/Hero/Hero";
import Stats from "../components/Stats/Stats";
import Features from "../components/Features/Features";
import Workflow from "../components/Workflow/Workflow";
import Technology from "../components/Technology/Technology";
import About from "../components/About/About";
import CTA from "../components/CTA/CTA";

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white overflow-x-hidden">

      <LandingNavbar />

      <main>
        <Hero />
        <Stats />
        <Features />
        <Workflow />
        <Technology />
        <About />
        <CTA />
      </main>

      <footer className="border-t border-white/10 py-10 text-center">
        <p className="text-slate-400 text-sm">
          CareerLens AI · Explainable Career Intelligence
        </p>

        <p className="text-slate-500 text-sm mt-3">
          Built with React, Node.js, Flask, and scikit-learn
        </p>
      </footer>

    </div>
  );
}

export default LandingPage;