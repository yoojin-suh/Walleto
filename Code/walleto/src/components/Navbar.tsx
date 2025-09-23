"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/30 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="text-2xl font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] bg-clip-text text-transparent">
            Walleto
          </div>

          <div className="hidden items-center space-x-6 md:flex">
            <a href="#features" className="text-gray-700 transition hover:text-purple-600">Features</a>
            <a href="#how-it-works" className="text-gray-700 transition hover:text-purple-600">How It Works</a>
            <a href="#pricing" className="text-gray-700 transition hover:text-purple-600">Pricing</a>
            <a href="#testimonials" className="text-gray-700 transition hover:text-purple-600">Reviews</a>
            <button className="rounded-lg border border-purple-600 px-4 py-2 text-purple-600 transition hover:bg-purple-50">
              Sign In
            </button>
            <button className="rounded-lg px-4 py-2 text-white transition
                               bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                               hover:-translate-y-[2px] hover:shadow-[0_10px_25px_rgba(102,126,234,0.4)]">
              Start Free Trial
            </button>
          </div>

          <button className="p-2 md:hidden" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute left-0 top-16 w-full border-t border-gray-200 bg-white shadow-lg md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-col space-y-3">
              {[
                ["#features", "Features"],
                ["#how-it-works", "How It Works"],
                ["#pricing", "Pricing"],
                ["#testimonials", "Reviews"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="text-gray-900 transition hover:text-purple-600" onClick={() => setOpen(false)}>
                  {label}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 rounded-lg border border-purple-600 px-4 py-2 text-purple-600 hover:bg-purple-50" onClick={() => setOpen(false)}>
                  Sign In
                </button>
                <button className="flex-1 rounded-lg px-4 py-2 text-white
                                   bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                                   hover:-translate-y-[2px] hover:shadow-[0_10px_25px_rgba(102,126,234,0.4)]"
                        onClick={() => setOpen(false)}>
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
