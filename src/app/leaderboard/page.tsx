const leaderboardData = [
  { rank: 1, title: 'Dune: Part Two', score: '9.3' },
  { rank: 2, title: 'Oppenheimer', score: '9.1' },
  { rank: 3, title: 'The Bear', score: '8.9' },
  { rank: 4, title: 'The Last of Us', score: '8.8' },
  { rank: 5, title: 'Past Lives', score: '8.7' },
]

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen text-white">
      <section className="glass-panel mx-auto max-w-5xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Leaderboard</h1>
        <p className="mt-3 text-slate-300">Top trending picks from the community this week.</p>
      </section>

      <section className="glass-panel mx-auto mt-6 max-w-5xl overflow-hidden">
        <ul>
          {leaderboardData.map((item) => (
            <li key={item.rank} className="flex items-center justify-between border-b border-white/10 px-4 py-4 last:border-b-0">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300 font-bold text-[#032541]">
                  {item.rank}
                </span>
                <p className="font-medium">{item.title}</p>
              </div>
              <p className="font-semibold text-cyan-200">{item.score}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
