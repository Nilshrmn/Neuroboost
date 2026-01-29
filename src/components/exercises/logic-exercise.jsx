"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft } from "lucide-react"
import { calculatePoints, updateUserProgress, updateStreak } from "@/lib/points"
import { ResultScreen } from "@/components/exercises/result-screen"
import { progressManager } from "@/lib/progress"

const LOGIC_BANK = {
  1: [
    { question: "Was kommt als nächstes: 2, 4, 8, 16, ?", options: ["20", "24", "32", "64"], correct: 2 },
    { question: "Welche Zahl passt nicht: 2, 4, 6, 9, 10", options: ["2", "6", "9", "10"], correct: 2 },
    { question: "5 + 5 × 5 = ?", options: ["30", "50", "25", "55"], correct: 0 },
    { question: "Wenn alle A B sind und alle B C sind, dann sind alle A ...?", options: ["D", "C", "B", "Nichts davon"], correct: 1 },
    { question: "Was kommt als nächstes: ○ △ ○ ○ △ ○ ○ ○ ?", options: ["○", "△", "□", "○ △"], correct: 1 },
  ],
  2: [
    { question: "Welche Zahl kommt als nächstes: 3, 6, 12, 24, ?", options: ["30", "36", "48", "60"], correct: 2 },
    { question: "Wenn kein A ein B ist und alle B C sind: Dann gilt ...", options: ["Kein A ist C", "Alle A sind C", "Kein C ist A (möglich)", "Alle C sind A"], correct: 2 },
    { question: "Welche Form ergänzt: ▲ ■ ▲ ■ ▲ ?", options: ["■", "▲", "●", "▲■"], correct: 0 },
    { question: "Welche Zahl passt: 1, 1, 2, 3, 5, ?", options: ["6", "7", "8", "9"], correct: 2 },
    { question: "In einer Reihe stehen 5 Personen. Anna ist links von Ben. Ben ist links von Carla. Wer steht in der Mitte?", options: ["Anna", "Ben", "Carla", "Unbestimmt"], correct: 3 },
    { question: "8 ÷ 2(2+2) = ?", options: ["1", "8", "16", "32"], correct: 2 },
  ],
  3: [
    { question: "Welche Zahl kommt als nächstes: 2, 6, 12, 20, 30, ?", options: ["36", "40", "42", "56"], correct: 2 }, // n^2+n
    { question: "Welche Aussage ist logisch äquivalent zu: ¬(A ∧ B)?", options: ["¬A ∧ ¬B", "¬A ∨ ¬B", "A ∨ B", "A ∧ B"], correct: 1 },
    { question: "Zahlenfolge: 1, 4, 9, 16, 25, ?, 49", options: ["30", "32", "36", "40"], correct: 2 },
    { question: "Welche Zahl passt nicht: 11, 13, 17, 19, 21", options: ["11", "13", "19", "21"], correct: 3 },
    { question: "Wenn A → B und B → C und C ist falsch, dann ist ...", options: ["A wahr", "B wahr", "A falsch", "Nichts folgt sicher"], correct: 2 },
    { question: "Drei Schalter, drei Lampen (im anderen Raum). Wie viele Durchgänge brauchst du minimal, um alle Zuordnungen sicher zu kennen?", options: ["1", "2", "3", "4"], correct: 1 },
    { question: "Welche Zahl kommt als nächstes: 5, 10, 8, 16, 14, 28, ?", options: ["26", "24", "18", "20"], correct: 1 },
  ],
}

const LEVEL_CONFIG = {
  1: { totalTime: 180, difficulty: "easy" },
  2: { totalTime: 165, difficulty: "medium" },
  3: { totalTime: 150, difficulty: "hard" },
}

export function LogicExercise({ exerciseId = "logic", level = 1, onComplete, onBack }) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1]
  const QUESTIONS = useMemo(() => LOGIC_BANK[level] || LOGIC_BANK[1], [level])

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
              <p className="text-sm text-muted-foreground">Logik – Level {level}</p>
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
          <CardTitle className="text-2xl text-balance leading-relaxed">{QUESTIONS[currentQuestion].question}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <div className="grid gap-3">
            {QUESTIONS[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className="h-16 text-lg justify-start bg-transparent"
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
