"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft } from "lucide-react"
import { calculatePoints, updateUserProgress, updateStreak } from "@/lib/points"
import { ResultScreen } from "@/components/exercises/result-screen"
import { progressManager } from "@/lib/progress"

const LEVEL_CONFIG = {
  1: { totalTime: 180, questions: 8, difficulty: "easy" },
  2: { totalTime: 170, questions: 10, difficulty: "medium" },
  3: { totalTime: 150, questions: 10, difficulty: "hard" },
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function uniqueOptions(answer, count = 4) {
  const opts = new Set([answer])
  const spread = Math.max(3, Math.round(Math.abs(answer) * 0.15))
  while (opts.size < count) {
    const delta = Math.floor(Math.random() * (spread * 2 + 1)) - spread
    const candidate = answer + (delta === 0 ? spread : delta)
    opts.add(candidate)
  }
  return shuffle(Array.from(opts)).map((n) => n.toString())
}

function generateQuestion(level) {
  if (level === 1) {
    const op = Math.random() < 0.5 ? "+" : "-"
    let a = Math.floor(Math.random() * 30) + 1
    let b = Math.floor(Math.random() * 20) + 1
    if (op === "-" && b > a) [a, b] = [b, a]
    const answer = op === "+" ? a + b : a - b
    const options = uniqueOptions(answer)
    return { question: `${a} ${op} ${b} = ?`, options, correct: options.indexOf(answer.toString()) }
  }

  if (level === 2) {
    const operations = ["+", "-", "×", "÷"]
    const op = operations[Math.floor(Math.random() * operations.length)]
    let a, b, answer

    if (op === "×") {
      a = Math.floor(Math.random() * 12) + 2
      b = Math.floor(Math.random() * 12) + 2
      answer = a * b
    } else if (op === "÷") {
      b = Math.floor(Math.random() * 9) + 2
      answer = Math.floor(Math.random() * 15) + 1
      a = b * answer
    } else if (op === "+") {
      a = Math.floor(Math.random() * 60) + 10
      b = Math.floor(Math.random() * 40) + 5
      answer = a + b
    } else {
      a = Math.floor(Math.random() * 60) + 10
      b = Math.floor(Math.random() * 40) + 5
      if (b > a) [a, b] = [b, a]
      answer = a - b
    }

    const options = uniqueOptions(answer)
    return { question: `${a} ${op} ${b} = ?`, options, correct: options.indexOf(answer.toString()) }
  }

  // level 3: mehrschrittig
  const variant = Math.floor(Math.random() * 4)
  let expr = ""
  let answer = 0

  if (variant === 0) {
    const a = Math.floor(Math.random() * 40) + 10
    const b = Math.floor(Math.random() * 8) + 2
    const c = Math.floor(Math.random() * 8) + 2
    expr = `${a} + ${b} × ${c}`
    answer = a + b * c
  } else if (variant === 1) {
    let a = Math.floor(Math.random() * 60) + 20
    const b = Math.floor(Math.random() * 15) + 5
    const c = Math.floor(Math.random() * 8) + 2
    if (b > a) a = b + 10
    expr = `(${a} - ${b}) × ${c}`
    answer = (a - b) * c
  } else if (variant === 2) {
    const a = Math.floor(Math.random() * 14) + 3
    const b = Math.floor(Math.random() * 14) + 3
    const c = Math.floor(Math.random() * 30) + 5
    expr = `${a} × ${b} + ${c}`
    answer = a * b + c
  } else {
    const b = Math.floor(Math.random() * 9) + 2
    const c = Math.floor(Math.random() * 9) + 2
    const a = b * c * (Math.floor(Math.random() * 6) + 2)
    expr = `${a} ÷ ${b} - ${c}`
    answer = a / b - c
  }

  const options = uniqueOptions(answer)
  return { question: `${expr} = ?`, options, correct: options.indexOf(answer.toString()) }
}

export function MathExercise({ exerciseId = "math", level = 1, onComplete, onBack }) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1]

  const questions = useMemo(() => Array.from({ length: cfg.questions }, () => generateQuestion(level)), [cfg.questions, level])

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
      total: questions.length,
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
    if (index === questions[currentQuestion].correct) {
      setScore((s) => s + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1)
    } else {
      finishExercise()
    }
  }

  if (showResult) {
    return <ResultScreen score={score} total={questions.length} onComplete={onComplete} />
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
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
              <p className="text-sm text-muted-foreground">Rechnen – Level {level}</p>
              <p className="font-semibold">
                {currentQuestion + 1} / {questions.length}
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
          <CardTitle className="text-4xl md:text-5xl text-center font-mono font-bold">
            {questions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className="h-20 text-2xl font-mono bg-transparent"
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
