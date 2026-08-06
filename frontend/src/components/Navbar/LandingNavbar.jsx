import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B1020]/70 border-b border-white/10">

      <div className="
        max-w-7xl
        mx-auto
        px-6
        lg:px-8
        h-20
        flex
        items-center
        justify-between
      ">

        {/* Logo + Brand */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3"
        >

          <div className="
            w-12
            h-12
            rounded-xl
            bg-gradient-to-r
            from-purple-600
            to-cyan-500
            flex
            items-center
            justify-center
            shadow-lg
            shadow-purple-500/20
          ">
            <BrainCircuit
              className="text-white"
              size={26}
              strokeWidth={2.2}
            />
          </div>


          <div>

            <h1 className="font-bold text-xl">
              CareerLens AI
            </h1>

            <p className="text-sm text-slate-400">
              Explainable Career Intelligence
            </p>

          </div>

        </Link>


        {/* Navigation Links */}
        <div className="
          hidden
          md:flex
          items-center
          gap-8
          text-sm
          text-slate-300
        ">

          <a
            href="#features"
            className="hover:text-cyan-400 transition"
          >
            Features
          </a>


          <a
            href="#workflow"
            className="hover:text-cyan-400 transition"
          >
            Workflow
          </a>


          <a
            href="#technology"
            className="hover:text-cyan-400 transition"
          >
            Technology
          </a>


          <a
            href="#about"
            className="hover:text-cyan-400 transition"
          >
            About
          </a>

        </div>


        {/* Auth Buttons */}
        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="
              px-5
              py-2.5
              rounded-lg
              border
              border-white/10
              font-medium
              hover:border-cyan-400
              transition
            "
          >
            Login
          </Link>


          <Link
            to="/signup"
            className="
              px-5
              py-2.5
              rounded-lg
              bg-gradient-to-r
              from-purple-600
              to-cyan-500
              font-medium
              hover:scale-105
              transition
            "
          >
            Get Started
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;