export default function DiscussionPage() {
  return (
    <main className="min-h-screen text-white">
      <section className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-900/45 p-6 sm:p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Discussion</h1>
        <p className="mt-3 text-slate-300">
          Join conversations about new releases, hidden gems, cast performances, and weekly recommendations.
        </p>
      </section>

      <section className="mx-auto mt-6 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {['Movie Debates', 'Fan Theories', 'What To Watch Next'].map((topic) => (
          <article key={topic} className="rounded-2xl border border-white/10 bg-slate-900/55 p-5">
            <h2 className="text-lg font-semibold">{topic}</h2>
            <p className="mt-2 text-sm text-slate-300">
              Curated threads updated regularly with community picks and editor prompts.
            </p>
          </article>
        ))}
      </section>
    </main>
  )
}
