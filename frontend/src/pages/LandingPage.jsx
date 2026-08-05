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
      <Hero />
      <Stats />
      <Features />
      <Workflow />
      <Technology />
      <About />
      <CTA />
      <footer className="border-t border-white/10 py-8 text-center">
        <p className="text-slate-500 text-sm">Placement Prediction Portal · Explainable AI</p>
        <p className="text-slate-600 text-xs mt-2">Built with React, Node.js, Flask, and scikit-learn</p>
      </footer>
    </div>
  );
}

export default LandingPage;