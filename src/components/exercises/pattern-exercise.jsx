"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft } from "lucide-react"
import { calculatePoints, updateUserProgress, updateStreak } from "@/lib/points"
import { ResultScreen } from "@/components/exercises/result-screen"
import { progressManager } from "@/lib/progress"

const BANK = {
  1: [
    { pattern: ["■", "□", "■", "□", "■"], question: "Was kommt als nächstes?", options: ["■", "□", "■■", "□□"], correct: 1 },
    { pattern: ["🔴", "🔴", "🔵", "🔴", "🔴", "🔵"], question: "Was kommt als nächstes?", options: ["🔴", "🔵", "🟢", "🔴🔴"], correct: 0 },
    { pattern: ["1", "2", "3", "4", "5"], question: "Was kommt als nächstes?", options: ["6", "7", "8", "10"], correct: 0 },
    { pattern: ["△", "△△", "△△△", "△△△△"], question: "Was kommt als nächstes?", options: ["△△△△", "△△△△△", "△", "△△"], correct: 1 },
    { pattern: ["A", "B", "C", "D", "E"], question: "Was kommt als nächstes?", options: ["F", "G", "H", "I"], correct: 0 },
  ],
  2: [
    { pattern: ["2", "4", "8", "16"], question: "Was kommt als nächstes?", options: ["18", "24", "32", "64"], correct: 2 },
    { pattern: ["1", "4", "9", "16", "25"], question: "Was kommt als nächstes?", options: ["30", "36", "49", "35"], correct: 1 },
    { pattern: ["⬆️", "➡️", "⬇️", "➡️", "⬆️"], question: "Was kommt als nächstes?", options: ["⬅️", "➡️", "⬇️", "⬆️"], correct: 1 },
    { pattern: ["A", "C", "F", "J"], question: "Was kommt als nächstes?", options: ["K", "L", "O", "P"], correct: 2 },
    { pattern: ["🔷", "🔶", "🔶", "🔷", "🔶", "🔶"], question: "Was kommt als nächstes?", options: ["🔷", "🔶", "🔷🔶", "🔶🔷"], correct: 0 },
    { pattern: ["3", "6", "9", "12"], question: "Was kommt als nächstes?", options: ["13", "14", "15", "18"], correct: 2 },
  ],
  3: [
    { pattern: ["1", "1", "2", "3", "5", "8"], question: "Was kommt als nächstes?", options: ["11", "12", "13", "14"], correct: 2 },
    { pattern: ["2", "6", "12", "20", "30"], question: "Was kommt als nächstes?", options: ["38", "40", "42", "44"], correct: 2 }, // n^2+n
    { pattern: ["🔺", "🔻", "🔺", "🔺", "🔻", "🔺", "🔺", "🔺"], question: "Was kommt als nächstes?", options: ["🔺", "🔻", "🔶", "🔺🔻"], correct: 1 },
    { pattern: ["A", "D", "H", "M"], question: "Was kommt als nächstes?", options: ["Q", "R", "S", "T"], correct: 0 }, // +3,+4,+5,+6
    { pattern: ["🟥", "🟦", "🟩", "🟥", "🟩", "🟦"], question: "Was kommt als nächstes?", options: ["🟥", "🟦", "🟩", "🟨"], correct: 0 },
    { pattern: ["4", "12", "6", "18", "9"], question: "Was kommt als nächstes?", options: ["27", "21", "24", "30"], correct: 0 }, // ×3 ÷2
    { pattern: ["◐", "◓", "◑", "◒"], question: "Was kommt als nächstes?", options: ["◐", "◓", "◑", "◒"], correct: 0 }, // Rotation
  ],
}

const LEVEL_CONFIG = {
  1: { totalTime: 180, difficulty: "easy" },
  2: { totalTime: 165, difficulty: "medium" },
  3: { totalTime: 150, difficulty: "hard" },
}

export function PatternExercise({ exerciseId = "pattern", level = 1, onComplete, onBack }) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1]
  const QUESTIONS = useMemo(() => BANK[level] || BANK[1], [level])

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(cfg.totalTime)
  const [startTime] = useState(Date.now())
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    setTimeLeft(cfg.totalTime)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          finishExercise()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const finishExercise = () => {
    const timeSpent = (Date.now() - startTime) / 1000
    const result = {
      correct: score,
      total: QUESTIONS.length,
      timeSpent,
      difficulty: cfg.difficulty,
    }

    const earnedPoints = calculatePoints(result)
    updateUserProgress(earnedPoints)
    updateStreak()
    progressManager.completeLevel(exerciseId, level, earnedPoints)

    setShowResult(true)
  }

  const handleAnswer = (index) => {
    if (index === QUESTIONS[currentQuestion].correct) {
      setScore((s) => s + 1)
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((q) => q + 1)
    } else {
      finishExercise()
    }
  }

  if (showResult) {
    return <ResultScreen score={score} total={QUESTIONS.length} onComplete={onComplete} />
  }

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

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
              <p className="text-sm text-muted-foreground">Muster – Level {level}</p>
              <p className="font-semibold">
                {currentQuestion + 1} / {QUESTIONS.length}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Zeit</p>
            <p className="text-2xl font-bold tabular-nums">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <div className="text-5xl font-bold text-center mb-6 flex gap-4 justify-center flex-wrap">
            {QUESTIONS[currentQuestion].pattern.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
            <span className="opacity-60">?</span>
          </div>
          <CardTitle className="text-2xl text-balance leading-relaxed text-center">
            {QUESTIONS[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <div className="grid gap-3">
            {QUESTIONS[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className="h-16 text-2xl justify-center bg-transparent"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Richtige Antworten: <span className="font-semibold text-foreground">{score}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
