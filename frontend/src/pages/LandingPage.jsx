import LandingNavbar from "../components/Navbar/LandingNavbar";
import Hero from "../components/Hero/Hero";
import Stats from "../components/Stats/Stats";
import Features from "../components/Features/Features";
import Workflow from "../components/Workflow/Workflow";
import Technology from "../components/Technology/Technology";
import About from "../components/About/About";
import CTA from "../components/CTA/CTA";
import Footer from "../components/Footer/Footer";

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
      <Footer />

    </div>
  );
}

export default LandingPage;