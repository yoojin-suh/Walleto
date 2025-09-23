export default function Body() {
  return (
    <>
      {/* Trust Badges */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold text-gray-600">FEATURED IN</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-xl font-bold text-gray-400">
            <span>Forbes</span><span>TechCrunch</span><span>WSJ</span><span>Product Hunt</span><span>Fast Company</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-16 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Everything You Need to Master Your Money</h2>
            <p className="text-lg text-gray-600">Powerful features that make budgeting actually enjoyable</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["🏦", "Automatic Bank Sync", "Connect all your accounts in one place. We support 12,000+ banks and credit cards with military-grade encryption.", "Learn more →"],
              ["🤖", "AI-Powered Insights", "Get personalized recommendations based on your spending patterns. Our AI helps you save an average of $600/month.", "See examples →"],
              ["📸", "Smart Receipt Scanner", "Snap a photo of any receipt and our OCR technology extracts all details automatically. Never lose a receipt again.", "Try it now →"],
              ["🎯", "Goal Tracking", "Set and track financial goals with visual progress bars. Whether it's a vacation or emergency fund, we'll help you get there.", "Set your first goal →"],
              ["👥", "Shared Budgets", "Perfect for couples and families. Share budgets, split expenses, and stay aligned on financial goals together.", "Invite partner →"],
              ["📊", "Business Features", "Freelancers and small businesses love our tax categorization, P&L statements, and invoice tracking features.", "Business plans →"],
            ].map(([icon, title, copy, cta]) => (
              <div key={title as string}
                   className="rounded-xl border border-gray-200 bg-white p-6 transition
                              hover:-translate-y-1 hover:border-indigo-400 hover:shadow-2xl">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-purple-100 text-2xl">{icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="mb-4 text-gray-600">{copy}</p>
                <a href="#" className="font-medium text-purple-600 hover:underline">{cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="scroll-mt-16 bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Get Started in 3 Simple Steps</h2>
          <p className="mb-12 text-lg text-gray-600">Join thousands who transformed their finances in minutes</p>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["1", "Connect Your Accounts", "Securely link your bank accounts, credit cards, and investments in 60 seconds"],
              ["2", "Set Your Budget", "Our AI suggests personalized budgets based on your spending history"],
              ["3", "Watch Your Money Grow", "Get real-time insights and alerts to stay on track with your financial goals"],
            ].map(([n, t, c]) => (
              <div key={n} className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                  <span className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] bg-clip-text text-3xl font-bold text-transparent">{n}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{t}</h3>
                <p className="text-gray-600">{c}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <button className="rounded-lg px-8 py-4 font-semibold text-white transition
                               bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                               hover:-translate-y-[2px] hover:shadow-[0_10px_25px_rgba(102,126,234,0.4)]">
              Get Started Free - No Credit Card Required
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            ["50K+", "Active Users"],
            ["$2.3M", "Saved Monthly"],
            ["12K+", "Banks Supported"],
            ["4.9★", "App Store Rating"],
          ].map(([n, l]) => (
            <div key={l as string}>
              <p className="mb-2 bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] bg-clip-text text-4xl font-bold text-transparent">{n}</p>
              <p className="text-gray-600">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-16 bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600">Start free, upgrade when you are ready</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
            {/* Free */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <h3 className="mb-2 text-2xl font-bold">Free</h3>
              <p className="mb-4 text-gray-600">Perfect for getting started</p>
              <p className="mb-6 text-4xl font-bold">$0<span className="text-lg text-gray-600">/month</span></p>
              <ul className="mb-8 space-y-3">
                {["2 bank accounts","Basic budgeting","Manual transactions","Mobile app"].map((t) => (
                  <li key={t} className="flex items-start"><span className="mr-2 mt-1 text-green-500">✓</span><span>{t}</span></li>
                ))}
                <li className="flex items-start text-gray-400"><span className="mr-2 mt-1">✗</span><span>AI insights</span></li>
                <li className="flex items-start text-gray-400"><span className="mr-2 mt-1">✗</span><span>Receipt scanning</span></li>
              </ul>
              <button className="w-full rounded-lg border border-purple-600 px-6 py-3 text-purple-600 transition hover:bg-purple-50">Start Free</button>
            </div>

            {/* Personal */}
            <div className="relative rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-white lg:scale-105 lg:z-10">
              <div className="absolute left-1/2 -top-4 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-sm font-semibold text-black">
                MOST POPULAR
              </div>
              <h3 className="mb-2 text-2xl font-bold">Personal</h3>
              <p className="mb-4 text-purple-100">Everything you need to succeed</p>
              <p className="mb-6 text-4xl font-bold">$8<span className="text-lg text-purple-100">/month</span></p>
              <ul className="mb-8 space-y-3">
                {["Unlimited accounts","AI-powered insights","Receipt scanning (OCR)","Goal tracking","Bill reminders","Priority support"].map(t => (
                  <li key={t} className="flex items-start"><span className="mr-2 mt-1">✓</span><span>{t}</span></li>
                ))}
              </ul>
              <button className="w-full rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 transition hover:bg-gray-100">Start 30-Day Trial</button>
            </div>

            {/* Business */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <h3 className="mb-2 text-2xl font-bold">Business</h3>
              <p className="mb-4 text-gray-600">For freelancers & small teams</p>
              <p className="mb-6 text-4xl font-bold">$20<span className="text-lg text-gray-600">/month</span></p>
              <ul className="mb-8 space-y-3">
                {["Everything in Personal","Multi-user access","Tax categorization","P&L statements","Invoice tracking","Dedicated support"].map(t => (
                  <li key={t} className="flex items-start"><span className="mr-2 mt-1 text-green-500">✓</span><span>{t}</span></li>
                ))}
              </ul>
              <button className="w-full rounded-lg px-6 py-3 text-white
                                 bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]">Start Business Trial</button>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-600">
            All plans include 256-bit SSL encryption, automatic backups, and GDPR compliance
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="scroll-mt-16 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Loved by 50,000+ Users</h2>
            <p className="text-lg text-gray-600">See why people are switching to Walleto</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["★★★★★","\"Finally, a budget app that actually syncs with my bank! The AI insights helped me save $800 last month alone.\"","Sarah Chen","Marketing Manager","bg-purple-400"],
              ["★★★★★","\"The receipt scanner saves me hours during tax season. As a freelancer, the business features are exactly what I needed.\"","Marcus Johnson","Freelance Designer","bg-purple-500"],
              ["★★★★★","\"Sharing budgets with my partner changed everything. We're finally on the same page financially and saved for our house!\"","Emily Rodriguez","Teacher","bg-purple-600"],
            ].map(([stars, quote, name, role, avatar]) => (
              <div key={name as string} className="rounded-xl bg-gray-50 p-6">
                <div className="mb-4 flex">{stars}</div>
                <p className="mb-4 text-gray-700">{quote}</p>
                <div className="flex items-center">
                  <div className={`mr-3 h-10 w-10 rounded-full ${avatar as string}`}></div>
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-gray-600">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold lg:text-4xl">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              ["Is my financial data secure?","Absolutely. We use bank-level 256-bit SSL encryption and partner with Plaid for secure bank connections. We're also SOC 2 certified and GDPR compliant."],
              ["Which banks do you support?","We support over 12,000 banks and financial institutions across the US, Canada, and Europe, including all major banks and credit cards."],
              ["Can I cancel anytime?","Yes! There are no contracts or cancellation fees. You can upgrade, downgrade, or cancel your subscription anytime."],
              ["Do you offer student discounts?","Yes! Students get 50% off all paid plans with a valid .edu email address."],
            ].map(([q,a]) => (
              <details key={q as string} className="cursor-pointer rounded-lg bg-white p-6">
                <summary className="text-lg font-semibold">{q}</summary>
                <p className="mt-4 text-gray-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20
                          bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <h2 className="mb-6 text-4xl font-bold lg:text-5xl">Ready to Transform Your Finances?</h2>
          <p className="mb-8 text-xl text-purple-100">Join 50,000+ users who save an average of $600/month with Walleto</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-white px-8 py-4 font-semibold text-purple-600 transition hover:bg-gray-100">
              Start Your Free 30-Day Trial
            </button>
            <button className="rounded-lg border border-white/10 bg-black/30 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20">
              Schedule a Demo
            </button>
          </div>
          <p className="mt-6 text-sm text-purple-200">No credit card required • Setup in 2 minutes • Cancel anytime</p>
        </div>
      </section>
    </>
  );
}
