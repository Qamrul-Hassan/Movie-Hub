export default function SupportPage() {
  return (
    <main className="min-h-screen text-white">
      <section className="mx-auto max-w-6xl py-4">
        <div className="glass-panel p-6 sm:p-10 motion-safe:animate-fade-in">
          <h1 className="text-3xl sm:text-5xl font-bold">Support Movie Hub</h1>
          <p className="text-gray-200 mt-4 max-w-2xl">
            Help us keep Movie Hub fast, ad-light, and constantly improving. Your support powers design updates,
            performance work, and better discovery features.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full border border-cyan-300/30 bg-cyan-300 px-5 py-2.5 font-semibold text-[#032541] transition hover:brightness-110"
            >
              One-time Support
            </button>
            <button
              type="button"
              className="rounded-full border border-cyan-500 px-5 py-2.5 font-semibold text-cyan-100 transition hover:bg-cyan-500/15"
            >
              Monthly Support
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto pb-12">
        <h2 className="text-2xl font-semibold mb-4">Where support goes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article className="glass-panel p-5">
            <h3 className="font-semibold text-lg">Performance</h3>
            <p className="text-gray-300 mt-2">Faster image delivery, lighter components, and smoother page transitions.</p>
          </article>
          <article className="glass-panel p-5">
            <h3 className="font-semibold text-lg">Accessibility</h3>
            <p className="text-gray-300 mt-2">Keyboard support, contrast tuning, and reduced-motion friendly interactions.</p>
          </article>
          <article className="glass-panel p-5">
            <h3 className="font-semibold text-lg">New Features</h3>
            <p className="text-gray-300 mt-2">Advanced search, personalized recommendations, and better watch options.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
