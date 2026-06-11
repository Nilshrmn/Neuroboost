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
    { text: "GEHIRNTRAINING", question: "Wie viele Vokale (A, E, I, O, U) enthält das Wort?", options: ["4", "5", "6", "7"], correct: 1 },
    { text: "Der schnelle braune Fuchs springt über den faulen Hund", question: "Wie viele Wörter enthält der Satz?", options: ["7", "8", "9", "10"], correct: 2 },
    { text: "🔴🔵🔴🟢🔴🔵🟡🔴🔵", question: "Wie oft kommt 🔴 vor?", options: ["3", "4", "5", "6"], correct: 1 },
    { text: "2847593610", question: "Wie viele gerade Zahlen sind enthalten?", options: ["4", "5", "6", "7"], correct: 1 },
    { text: "AAABAACAAADAAAEAAAFAAA", question: "Wie oft kommt der Buchstabe A vor?", options: ["15", "16", "17", "18"], correct: 2 },
  ],
  2: [
    { text: "NEUROBOOSTKONZENTRATIONSTRAINING", question: "Wie viele Buchstaben 'O' sind enthalten?", options: ["1", "2", "3", "4"], correct: 2 },
    { text: "Rote Rosen rascheln leise im Regen", question: "Wie viele Buchstaben 'r' (groß/klein) sind enthalten?", options: ["5", "6", "7", "8"], correct: 2 },
    { text: "🟩🟥🟦🟥🟩🟥🟦🟦🟥🟩", question: "Wie oft kommt 🟥 vor?", options: ["3", "4", "5", "6"], correct: 2 },
    { text: "918273645546372819", question: "Wie viele ungerade Zahlen sind enthalten?", options: ["8", "9", "10", "11"], correct: 1 },
    { text: "ABRACADABRAABRACADABRA", question: "Wie oft kommt 'BRA' als zusammenhängende Folge vor?", options: ["2", "3", "4", "5"], correct: 2 },
    { text: "QWERTZUIOPASDFGHJKLYXCVBNM", question: "Wie viele Buchstaben stehen zwischen A und M (alphabetisch)?", options: ["10", "11", "12", "13"], correct: 1 },
  ],
  3: [
    { text: "DIEKONZENTRATIONISTEINMUSKELDERTRAINIERTWERDENKANN", question: "Wie viele 'N' sind enthalten?", options: ["6", "7", "8", "9"], correct: 2 },
    { text: "🟡🔴🟡🟢🟡🔴🟡🟢🟡🔴🟡", question: "Wie oft kommt 🟢 vor?", options: ["2", "3", "4", "5"], correct: 1 },
    { text: "001001000100010001000", question: "Wie viele Gruppen '1000' sind enthalten?", options: ["3", "4", "5", "6"], correct: 1 },
    { text: "SCHIFFFAHRTSGESELLSCHAFTSKAPITÄN", question: "Wie viele Doppelbuchstaben (z.B. FF, LL) sind enthalten?", options: ["2", "3", "4", "5"], correct: 1 },
    { text: "BANANENBANANENBANANEN", question: "Wie oft kommt die Folge 'NEN' vor?", options: ["2", "3", "4", "5"], correct: 3 },
    { text: "73918465027193846502", question: "Wie viele Ziffern sind kleiner als 5?", options: ["8", "9", "10", "11"], correct: 2 },
    { text: "XAXAXBAXAXXBAXAXA", question: "Wie oft kommt die Folge 'BAX' vor?", options: ["1", "2", "3", "4"], correct: 1 },
  ],
}

const LEVEL_CONFIG = {
  1: { totalTime: 200, difficulty: "easy" },
  2: { totalTime: 180, difficulty: "medium" },
  3: { totalTime: 165, difficulty: "hard" },
}

export function ConcentrationExercise({ exerciseId = "concentration", level = 1, onComplete, onBack }) {
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
              <p className="text-sm text-muted-foreground">Konzentration – Level {level}</p>
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
          <div className="text-3xl font-mono font-bold text-center mb-6 break-all leading-relaxed">
            {QUESTIONS[currentQuestion].text}
          </div>
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
