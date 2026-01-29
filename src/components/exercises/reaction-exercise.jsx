"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft, Zap } from "lucide-react"
import { calculatePoints, updateUserProgress, updateStreak } from "@/lib/points"
import { ResultScreen } from "@/components/exercises/result-screen"
import { progressManager } from "@/lib/progress"

const LEVEL_CONFIG = {
  1: { rounds: 5, minDelay: 1000, maxDelay: 4000, thresholdMs: 500, noGo: false },
  2: { rounds: 7, minDelay: 800, maxDelay: 2800, thresholdMs: 450, noGo: false },
  3: { rounds: 8, minDelay: 700, maxDelay: 2400, thresholdMs: 450, noGo: true, redChance: 0.35 },
}

export function ReactionExercise({ exerciseId = "reaction", level = 1, onComplete, onBack }) {
  const cfg = useMemo(() => LEVEL_CONFIG[level] || LEVEL_CONFIG[1], [level])

  const [phase, setPhase] = useState("waiting") // waiting | signal | result
  const [signal, setSignal] = useState("green") // green | red
  const [round, setRound] = useState(0)
  const [reactionTimes, setReactionTimes] = useState([]) // only green clicks
  const [mistakes, setMistakes] = useState(0) // red clicks + misses
  const [startTime, setStartTime] = useState(0)
  const [overallStartTime] = useState(Date.now())

  const timeoutRef = useRef(null)
  const signalTimeoutRef = useRef(null)

  const clearTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (signalTimeoutRef.current) clearTimeout(signalTimeoutRef.current)
    timeoutRef.current = null
    signalTimeoutRef.current = null
  }

  const scheduleNextSignal = () => {
    clearTimers()
    const delay = Math.random() * (cfg.maxDelay - cfg.minDelay) + cfg.minDelay
    timeoutRef.current = setTimeout(() => {
      const nextSignal = cfg.noGo && Math.random() < (cfg.redChance ?? 0.3) ? "red" : "green"
      setSignal(nextSignal)
      setPhase("signal")
      setStartTime(Date.now())

      if (nextSignal === "red") {
        // Wenn kein Klick kommt, gilt es als korrektes Nicht-Klicken.
        signalTimeoutRef.current = setTimeout(() => {
          advanceRound()
        }, 900)
      } else {
        // Timeout: wenn zu langsam / kein Klick
        signalTimeoutRef.current = setTimeout(() => {
          setMistakes((m) => m + 1)
          advanceRound()
        }, 1500)
      }
    }, delay)
  }

  const advanceRound = () => {
    clearTimers()
    if (round < cfg.rounds - 1) {
      setRound((r) => r + 1)
      setPhase("waiting")
    } else {
      finishExercise()
    }
  }

  useEffect(() => {
    setPhase("waiting")
    setRound(0)
    setReactionTimes([])
    setMistakes(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level])

  useEffect(() => {
    if (phase === "waiting") {
      scheduleNextSignal()
    }
    return () => clearTimers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round])

  const handleClick = () => {
    if (phase !== "signal") return

    if (signal === "red") {
      // Fehler: bei Rot geklickt
      setMistakes((m) => m + 1)
      advanceRound()
      return
    }

    const reactionTime = Date.now() - startTime
    setReactionTimes((times) => [...times, reactionTime])
    advanceRound()
  }

  const finishExercise = () => {
    clearTimers()

    const greens = reactionTimes.length
    const fastGreens = reactionTimes.filter((t) => t < cfg.thresholdMs).length
    const score = Math.max(0, fastGreens - mistakes)

    const timeSpent = (Date.now() - overallStartTime) / 1000
    const avgReactionTime = greens > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / greens : 9999

    const result = {
      correct: score,
      total: cfg.rounds,
      timeSpent,
      difficulty: level === 1 ? "easy" : level === 2 ? "medium" : "hard",
    }

    const earnedPoints = calculatePoints(result)
    updateUserProgress(earnedPoints)
    updateStreak()
    progressManager.completeLevel(exerciseId, level, earnedPoints)

    setPhase("result")
  }

  if (phase === "result") {
    const avgTime = reactionTimes.length
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0

    const extra = [
      reactionTimes.length ? `Durchschnittliche Reaktionszeit: ${avgTime}ms` : null,
      mistakes ? `Fehler: ${mistakes}` : null,
      level === 3 ? "Hinweis: Bei Rot nicht klicken." : null,
    ]
      .filter(Boolean)
      .join(" · ")

    const fastGreens = reactionTimes.filter((t) => t < cfg.thresholdMs).length
    const displayScore = Math.max(0, fastGreens - mistakes)

    return <ResultScreen score={displayScore} total={cfg.rounds} onComplete={onComplete} extraInfo={extra || undefined} />
  }

  const progress = ((round + 1) / cfg.rounds) * 100

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col">
      <Button variant="ghost" onClick={onBack} className="mb-6 self-start">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Zurück
      </Button>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reaktion – Level {level}</p>
              <p className="font-semibold">
                {round + 1} / {cfg.rounds}
              </p>
            </div>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      <Card
        className={`flex-1 flex flex-col cursor-pointer transition-all ${
          phase === "signal" && signal === "green"
            ? "bg-green-500 border-green-600"
            : phase === "signal" && signal === "red"
              ? "bg-red-500 border-red-600"
              : "bg-card"
        }`}
        onClick={handleClick}
      >
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          {phase === "waiting" && (
            <>
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-muted-foreground/30"></div>
              </div>
              <p className="text-2xl font-semibold text-muted-foreground">Warte…</p>
              <p className="text-sm text-muted-foreground mt-2">
                {level === 3 ? "Klicke nur bei Grün." : "Klicke, wenn der Bildschirm grün wird!"}
              </p>
            </>
          )}

          {phase === "signal" && signal === "green" && (
            <>
              <Zap className="w-20 h-20 text-white mb-6" />
              <p className="text-3xl font-bold text-white">JETZT KLICKEN!</p>
              <p className="text-sm text-white/80 mt-2">Schnell sein: &lt; {cfg.thresholdMs}ms</p>
            </>
          )}

          {phase === "signal" && signal === "red" && (
            <>
              <p className="text-4xl font-bold text-white">NICHT KLICKEN!</p>
              <p className="text-sm text-white/80 mt-2">Warte kurz…</p>
            </>
          )}
        </CardContent>
      </Card>

      {reactionTimes.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Letzte Reaktionszeit:{" "}
            <span className="font-semibold text-foreground">{reactionTimes[reactionTimes.length - 1]}ms</span>
          </p>
        </div>
      )}
    </div>
  )
}
