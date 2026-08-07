import { Link } from "react-router-dom";

function Footer() {
  const handleLogoClick = (e) => {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-white/10 py-7">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="text-center">

          <Link
            to="/"
            onClick={handleLogoClick}
            className="
              inline-block
              text-lg
              font-semibold
              hover:text-cyan-400
              transition
            "
          >
            CareerLens <span className="text-cyan-400">AI</span>
          </Link>

          <p className="text-slate-400 text-sm mt-1.5">
            Explainable Career Intelligence for Smarter Career Decisions
          </p>

          <p className="text-slate-500 text-xs mt-3">
            Powered by React, Node.js, Flask & scikit-learn
          </p>

        </div>

        <p className="text-slate-600 text-xs text-center mt-5">
          © 2026 CareerLens AI · Built for smarter career decisions.
        </p>

      </div>
    </footer>
  );
}

export default Footer;