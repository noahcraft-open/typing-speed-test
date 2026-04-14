import TypingTest from './components/TypingTest'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }} className="py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-xl" style={{ background: 'var(--accent)', color: 'white' }}>
            T
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>TypeRush</h2>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Free Typing Speed Test</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: 'var(--text)' }}>
            How Fast Can You Type?
          </h1>
          <p className="text-base" style={{ color: 'var(--muted)' }}>
            Test your typing speed and accuracy. Track your WPM in real-time.
          </p>
        </div>

        <TypingTest />

        {/* SEO Content */}
        <section className="mt-16 space-y-8 border-t pt-10" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
          <div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>What Is WPM?</h2>
            <p className="text-sm leading-relaxed mb-3">
              WPM (Words Per Minute) is the standard measure of typing speed. One &quot;word&quot; is defined as 5 characters (including spaces). So if you type 250 characters in one minute, your speed is 50 WPM.
            </p>
            <p className="text-sm leading-relaxed">
              This test measures <strong style={{ color: 'var(--text)' }}>net WPM</strong> — only correctly typed characters count toward your score. Errors are tracked separately and affect your accuracy percentage.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Average Typing Speed</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text)' }}>WPM Range</th>
                    <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text)' }}>Level</th>
                    <th className="text-left py-2 font-medium" style={{ color: 'var(--text)' }}>Description</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {[
                    { range: '0–20', level: 'Beginner', desc: 'Hunt-and-peck typist. Look at keyboard while typing.' },
                    { range: '20–40', level: 'Average', desc: 'Most people type at this speed. Adequate for daily tasks.' },
                    { range: '40–60', level: 'Fast', desc: 'Above average. Comfortable with touch typing.' },
                    { range: '60–80', level: 'Professional', desc: 'Professional typist level. Very efficient for work.' },
                    { range: '80–100', level: 'Expert', desc: 'Competitive typist. Top 5% of the population.' },
                    { range: '100+', level: 'Legend', desc: 'Elite level. Professional stenographers and speed typists.' },
                  ].map(row => (
                    <tr key={row.range} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2.5 pr-4 typing-font" style={{ color: 'var(--accent)' }}>{row.range}</td>
                      <td className="py-2.5 pr-4 font-medium" style={{ color: 'var(--text)' }}>{row.level}</td>
                      <td className="py-2.5" style={{ color: 'var(--muted)' }}>{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Tips to Improve Your Typing Speed</h3>
            <ul className="text-sm space-y-2 leading-relaxed">
              <li><span style={{ color: 'var(--accent)' }} className="font-medium">Learn touch typing</span> — Place your fingers on the home row (ASDF JKL;) and type without looking at the keyboard. It feels slow at first but pays off enormously.</li>
              <li><span style={{ color: 'var(--accent)' }} className="font-medium">Focus on accuracy first</span> — Speed comes naturally once you stop making mistakes. A typist with 95% accuracy at 40 WPM improves faster than one with 80% accuracy at 50 WPM.</li>
              <li><span style={{ color: 'var(--accent)' }} className="font-medium">Practice daily</span> — Even 10 minutes a day of focused practice leads to measurable improvement within a week.</li>
              <li><span style={{ color: 'var(--accent)' }} className="font-medium">Use all fingers</span> — Each finger is responsible for specific keys. Using all 10 fingers distributes the work and eliminates bottlenecks.</li>
              <li><span style={{ color: 'var(--accent)' }} className="font-medium">Don&apos;t look down</span> — Cover your keyboard with a cloth if you need to break the habit. Your muscle memory develops faster when you can&apos;t peek.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Why Typing Speed Matters for Developers</h3>
            <p className="text-sm leading-relaxed">
              For software developers, typing speed directly impacts productivity. A developer typing at 80 WPM can express ideas in code twice as fast as one at 40 WPM — that&apos;s not just about writing code faster, it&apos;s about keeping up with your thoughts. When your typing lags behind your thinking, you lose flow state and context.
            </p>
          </div>

          <div className="text-xs text-center pb-4" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            TypeRush — Free Typing Speed Test · No signup required
            <br />
            <span className="opacity-50">Built by Noah AI Labs · Part of the free tools suite</span>
          </div>
        </section>
      </main>
    </div>
  )
}
