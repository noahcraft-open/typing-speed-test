'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { generateText, type Difficulty, type Duration } from '../lib/words'

type GameState = 'idle' | 'countdown' | 'playing' | 'finished'

interface Stats {
  wpm: number
  rawWpm: number
  accuracy: number
  correctChars: number
  wrongChars: number
  totalChars: number
  correctWords: number
  wrongWords: number
  elapsed: number
  duration: Duration
  difficulty: Difficulty
}

function getWpmLabel(wpm: number): { label: string; color: string } {
  if (wpm < 20) return { label: 'Beginner', color: 'var(--wrong)' }
  if (wpm < 40) return { label: 'Average', color: 'var(--accent)' }
  if (wpm < 60) return { label: 'Fast', color: '#fbbf24' }
  if (wpm < 80) return { label: 'Pro', color: 'var(--correct)' }
  if (wpm < 100) return { label: 'Expert', color: '#818cf8' }
  return { label: 'Legend', color: '#c084fc' }
}

export default function TypingTest() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [duration, setDuration] = useState<Duration>(30)
  const [gameState, setGameState] = useState<GameState>('idle')
  const [countdown, setCountdown] = useState(3)
  const [text, setText] = useState('')
  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [stats, setStats] = useState<Stats | null>(null)
  const [charIndex, setCharIndex] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [wrongChars, setWrongChars] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const textDisplayRef = useRef<HTMLDivElement>(null)

  // Generate text
  const generateNewText = useCallback(() => {
    const wordCount = duration <= 30 ? 80 : duration <= 60 ? 150 : 250
    setText(generateText(difficulty, wordCount))
  }, [difficulty, duration])

  // Start game
  const startGame = useCallback(() => {
    generateNewText()
    setTyped('')
    setCharIndex(0)
    setCorrectChars(0)
    setWrongChars(0)
    setStats(null)
    setGameState('countdown')
    setCountdown(3)
  }, [generateNewText])

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'countdown') return
    if (countdown <= 0) {
      setGameState('playing')
      setStartTime(Date.now())
      setTimeLeft(duration)
      inputRef.current?.focus()
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [gameState, countdown, duration])

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) {
      finishGame()
      return
    }
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const remaining = Math.max(0, duration - elapsed)
      setTimeLeft(Math.ceil(remaining))
      if (remaining <= 0) {
        finishGame()
      }
    }, 100)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, startTime, duration, timeLeft])

  const finishGame = useCallback(() => {
    setGameState('finished')
    const elapsed = (Date.now() - startTime) / 1000
    const words = typed.trim().split(/\s+/)
    const textWords = text.split(' ')

    let correctWordCount = 0
    let wrongWordCount = 0
    words.forEach((w, i) => {
      if (w === textWords[i]) correctWordCount++
      else if (w.length > 0) wrongWordCount++
    })

    const minutesFraction = elapsed / 60
    const rawWpm = Math.round((typed.length / 5) / minutesFraction)
    const wpm = Math.round((correctChars / 5) / minutesFraction)
    const totalCharsTyped = correctChars + wrongChars
    const accuracy = totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 0

    setStats({
      wpm: Math.max(0, wpm),
      rawWpm,
      accuracy,
      correctChars,
      wrongChars,
      totalChars: totalCharsTyped,
      correctWords: correctWordCount,
      wrongWords: wrongWordCount,
      elapsed: Math.round(elapsed),
      duration,
      difficulty,
    })
  }, [startTime, typed, text, correctChars, wrongChars, duration, difficulty])

  // Handle keystrokes
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return
    const value = e.target.value
    const lastChar = value[value.length - 1]

    // Space = word boundary
    if (lastChar === ' ' && value.trim().length > 0) {
      setTyped(prev => prev + value)
      e.target.value = ''

      // Advance charIndex past the current word + space
      const currentWordEnd = text.indexOf(' ', charIndex)
      if (currentWordEnd !== -1) {
        const expectedWord = text.slice(charIndex, currentWordEnd)
        const typedWord = value.trim()
        if (typedWord === expectedWord) {
          setCorrectChars(c => c + expectedWord.length + 1)
        } else {
          setCorrectChars(c => c + 1) // space
          setWrongChars(w => w + Math.max(typedWord.length, expectedWord.length))
        }
        setCharIndex(currentWordEnd + 1)
      }

      // Auto-scroll the text
      if (textDisplayRef.current) {
        const activeChar = textDisplayRef.current.querySelector('.active-char')
        if (activeChar) {
          activeChar.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
      }
      return
    }

    // Check char-by-char for current word
    const currentInput = value
    const currentWordEnd = text.indexOf(' ', charIndex)
    const currentWord = currentWordEnd === -1 ? text.slice(charIndex) : text.slice(charIndex, currentWordEnd)

    // Update character tracking for display
    // We track per-character for color display
    e.target.value = value
  }, [gameState, text, charIndex])

  // Render the text with colored characters
  const renderText = () => {
    if (!text) return null

    const typedAll = typed + (inputRef.current?.value || '')
    const chars = text.split('')
    const typedChars = typedAll.split('')

    return chars.map((char, i) => {
      let className = 'typing-font text-lg sm:text-xl inline '
      if (i < typedChars.length) {
        if (typedChars[i] === char) {
          className += 'text-[var(--correct)]'
        } else {
          className += 'text-[var(--wrong)] bg-[var(--wrong)]/20 rounded'
        }
      } else if (i === typedChars.length) {
        className += 'active-char text-[var(--text)] border-l-2 border-[var(--cursor)] cursor-blink'
      } else {
        className += 'text-[var(--upcoming)]'
      }
      return <span key={i} className={className}>{char}</span>
    })
  }

  const wpmInfo = stats ? getWpmLabel(stats.wpm) : null

  return (
    <div className="space-y-5">
      {/* Settings */}
      {gameState === 'idle' && (
        <div className="fade-in space-y-4">
          {/* Difficulty */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-xs text-[var(--muted)] font-medium mb-3">DIFFICULTY</p>
            <div className="grid grid-cols-4 gap-2">
              {([
                { key: 'easy' as Difficulty, label: 'Easy', desc: 'Common words' },
                { key: 'medium' as Difficulty, label: 'Medium', desc: 'Developer terms' },
                { key: 'hard' as Difficulty, label: 'Hard', desc: 'Complex words' },
                { key: 'quotes' as Difficulty, label: 'Quotes', desc: 'Famous quotes' },
              ]).map(d => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  className={`py-3 rounded-lg text-sm font-medium transition-all border ${
                    difficulty === d.key
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                      : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]'
                  }`}
                >
                  <div>{d.label}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-xs text-[var(--muted)] font-medium mb-3">DURATION</p>
            <div className="grid grid-cols-4 gap-2">
              {([15, 30, 60, 120] as Duration[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-3 rounded-lg text-lg font-bold transition-all border ${
                    duration === d
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                      : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]'
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startGame}
            className="w-full py-4 rounded-xl text-xl font-bold text-white transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, var(--accent), #c2185b)' }}
          >
            Start Typing Test
          </button>
        </div>
      )}

      {/* Countdown */}
      {gameState === 'countdown' && (
        <div className="flex flex-col items-center justify-center py-20 fade-in">
          <div className="text-8xl font-black count-down" style={{ color: 'var(--accent)' }} key={countdown}>
            {countdown || 'GO!'}
          </div>
          <p className="text-[var(--muted)] mt-4">Get ready to type...</p>
        </div>
      )}

      {/* Playing */}
      {gameState === 'playing' && (
        <div className="space-y-4 fade-in">
          {/* Timer & Live Stats */}
          <div className="flex items-center justify-between bg-[var(--card)] border border-[var(--border)] rounded-xl px-5 py-3">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-[var(--muted)]">TIME</p>
                <p className="text-2xl font-bold typing-font" style={{ color: timeLeft <= 5 ? 'var(--wrong)' : 'var(--accent)' }}>
                  {timeLeft}s
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">WPM</p>
                <p className="text-2xl font-bold typing-font" style={{ color: 'var(--correct)' }}>
                  {startTime ? Math.round((correctChars / 5) / ((Date.now() - startTime) / 60000)) || 0 : 0}
                </p>
              </div>
            </div>
            <div className="text-xs text-[var(--muted)]">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} · {duration}s
            </div>
          </div>

          {/* Text Display */}
          <div
            ref={textDisplayRef}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 max-h-48 overflow-y-auto leading-relaxed select-none"
            onClick={() => inputRef.current?.focus()}
          >
            {renderText()}
          </div>

          {/* Hidden input */}
          <input
            ref={inputRef}
            type="text"
            autoFocus
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setGameState('idle')
              }
            }}
            className="w-full bg-[var(--card)] border-2 border-[var(--accent)] rounded-xl px-5 py-4 typing-font text-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            placeholder="Start typing here..."
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />

          <p className="text-xs text-center text-[var(--muted)]">Press ESC to restart</p>
        </div>
      )}

      {/* Results */}
      {gameState === 'finished' && stats && wpmInfo && (
        <div className="space-y-5 fade-in">
          {/* Main Result */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 text-center">
            <div className="mb-2">
              <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ color: wpmInfo.color, background: `${wpmInfo.color}20` }}>
                {wpmInfo.label}
              </span>
            </div>
            <div className="text-7xl font-black typing-font my-4" style={{ color: wpmInfo.color }}>
              {stats.wpm}
            </div>
            <p className="text-lg text-[var(--muted)]">Words Per Minute</p>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Accuracy', value: `${stats.accuracy}%`, color: stats.accuracy >= 95 ? 'var(--correct)' : stats.accuracy >= 85 ? '#fbbf24' : 'var(--wrong)' },
              { label: 'Raw WPM', value: stats.rawWpm.toString(), color: 'var(--muted)' },
              { label: 'Correct', value: `${stats.correctChars} chars`, color: 'var(--correct)' },
              { label: 'Errors', value: `${stats.wrongChars} chars`, color: stats.wrongChars > 0 ? 'var(--wrong)' : 'var(--correct)' },
            ].map(s => (
              <div key={s.label} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-center">
                <p className="text-xs text-[var(--muted)] mb-1">{s.label}</p>
                <p className="text-xl font-bold typing-font" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* WPM Scale */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-xs text-[var(--muted)] font-medium mb-3">HOW DO YOU COMPARE?</p>
            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(100, (stats.wpm / 120) * 100)}%`,
                  background: `linear-gradient(90deg, var(--accent), ${wpmInfo.color})`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[var(--muted)] mt-1.5">
              <span>0</span>
              <span>20 avg</span>
              <span>40</span>
              <span>60 fast</span>
              <span>80 pro</span>
              <span>100+</span>
              <span>120</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--accent), #c2185b)' }}
            >
              Try Again
            </button>
            <button
              onClick={() => setGameState('idle')}
              className="px-6 py-3.5 rounded-xl font-medium border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
