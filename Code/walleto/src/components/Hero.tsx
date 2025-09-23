export default function Hero() {
  return (
    <section className="pt-24 pb-16 min-h-[600px]
                        bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left */}
        <div className="text-white">
          <div className="mb-6 inline-flex items-center rounded-full border border-white/10
                          bg-black/30 px-3 py-1 text-sm backdrop-blur">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-400"></span>
            Trusted by 50,000+ users
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl xl:text-6xl">
            Take Control of Your Money with <span className="text-yellow-300">Confidence</span>
          </h1>
          <p className="mb-8 max-w-xl text-lg text-purple-100 lg:text-xl">
            The smart budget analyzer that learns your spending habits, syncs with your banks automatically,
            and gives you AI-powered insights to reach your financial goals faster.
          </p>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 transition hover:bg-gray-100">
              Start 30-Day Free Trial
            </button>
            <button className="flex items-center justify-center rounded-lg border border-white/10
                               bg-black/30 px-6 py-3 font-semibold text-white backdrop-blur transition
                               hover:bg-white/20">
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
              Watch 2-min Demo
            </button>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex -space-x-2">
              <div className="h-10 w-10 rounded-full bg-purple-400"></div>
              <div className="h-10 w-10 rounded-full bg-purple-500"></div>
              <div className="h-10 w-10 rounded-full bg-purple-600"></div>
              <div className="h-10 w-10 rounded-full bg-purple-700"></div>
            </div>
            <div>
              <div className="mb-1 flex text-yellow-300">★★★★★</div>
              <p className="text-sm text-purple-100">4.9/5 from 2,847 reviews</p>
            </div>
          </div>
        </div>

        {/* Right – card */}
        <div className="relative">
          <div className="mx-auto max-w-md rounded-2xl border border-white/30 bg-white/95 p-6 shadow-2xl backdrop-blur lg:max-w-none">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Monthly Overview</h3>
              <span className="text-sm text-gray-500">Dec 2024</span>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-gray-600">Income</p>
                <p className="text-2xl font-bold text-green-600">$5,500</p>
                <p className="text-xs text-green-500">+12% from last</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-gray-600">Expenses</p>
                <p className="text-2xl font-bold text-red-600">$3,247</p>
                <p className="text-xs text-green-500">-8% from last</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                ["Food & Dining", "$450/$600", "bg-purple-600", "w-[75%]"],
                ["Transportation", "$180/$300", "bg-blue-600", "w-[60%]"],
                ["Entertainment", "$120/$200", "bg-pink-600", "w-[60%]"],
              ].map(([label, amt, bar, width]) => (
                <div key={label as string}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{label}</span><span>{amt}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div className={`h-2 rounded-full ${bar as string} ${width as string}`}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-purple-50 p-3">
              <p className="mb-1 text-sm font-semibold text-purple-800">💡 AI Insight</p>
              <p className="text-xs text-purple-700">You are on track to save $2,253 this month!</p>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -top-4 -right-4 hidden rounded-full border border-white/30 bg-white/95 px-4 py-2 shadow-lg backdrop-blur sm:block">
            <span className="text-sm font-semibold">Bank Sync ✓</span>
          </div>
          <div className="absolute -bottom-4 -left-4 hidden rounded-full border border-white/30 bg-white/95 px-4 py-2 shadow-lg backdrop-blur sm:block">
            <span className="text-sm font-semibold">OCR Receipts 📸</span>
          </div>
        </div>
      </div>
    </section>
  );
}
