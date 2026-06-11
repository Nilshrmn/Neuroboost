"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft } from "lucide-react"
import { calculatePoints, updateUserProgress, updateStreak } from "@/lib/points"
import { ResultScreen } from "@/components/exercises/result-screen"
import { progressManager } from "@/lib/progress"

const MEMORY_BANK = {
  1: [
    { sequence: [7, 3, 9, 2], question: "Welche Zahl war an dritter Position?", options: ["3", "9", "2", "7"], correct: 1 },
    { sequence: ["Apfel", "Banane", "Kirsche", "Dattel"], question: "Welches Wort kam zuletzt?", options: ["Apfel", "Kirsche", "Dattel", "Banane"], correct: 2 },
    { sequence: ["🔴", "🔵", "🟢", "🟡"], question: "Welche Farbe kam an zweiter Stelle?", options: ["🔴", "🔵", "🟢", "🟡"], correct: 1 },
    { sequence: [42, 15, 88, 23], question: "Welche Zahl war die kleinste?", options: ["42", "15", "23", "88"], correct: 1 },
    { sequence: ["Berlin", "Paris", "London", "Rom"], question: "Welche Stadt kam an erster Stelle?", options: ["Paris", "Berlin", "London", "Rom"], correct: 1 },
  ],
  2: [
    { sequence: [7, 3, 9, 2, 5, 1], question: "Welche Zahl war an vierter Position?", options: ["2", "5", "1", "9"], correct: 0 },
    { sequence: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"], question: "Welcher Tag kam an zweiter Stelle?", options: ["Montag", "Dienstag", "Mittwoch", "Donnerstag"], correct: 1 },
    { sequence: ["🟥", "🟦", "🟦", "🟩", "🟥", "🟦"], question: "Wie oft kam 🟦 vor?", options: ["1", "2", "3", "4"], correct: 2 },
    { sequence: [12, 55, 9, 41, 73, 18], question: "Welche Zahl war die größte?", options: ["73", "55", "41", "18"], correct: 0 },
    { sequence: ["Zug", "Auto", "Fahrrad", "Bus", "Boot"], question: "Was kam direkt vor „Bus“?", options: ["Auto", "Fahrrad", "Zug", "Boot"], correct: 1 },
    { sequence: ["A", "C", "F", "J", "O"], question: "Welcher Buchstabe kam als drittes?", options: ["C", "F", "J", "O"], correct: 1 },
  ],
  3: [
    { sequence: [4, 19, 7, 2, 15, 9, 23], question: "Welche Zahl war an fünfter Position?", options: ["15", "9", "2", "23"], correct: 0 },
    { sequence: ["Lyon", "Oslo", "Bern", "Wien", "Prag", "Riga"], question: "Welche Stadt kam an vierter Stelle?", options: ["Bern", "Wien", "Prag", "Oslo"], correct: 1 },
    { sequence: ["🟢", "🔴", "🟡", "🔴", "🟢", "🔴", "🟡"], question: "Wie oft kam 🔴 vor?", options: ["2", "3", "4", "5"], correct: 1 },
    { sequence: ["Katze", "Hund", "Maus", "Pferd", "Esel", "Fuchs"], question: "Welches Tier kam NICHT vor?", options: ["Esel", "Fuchs", "Hase", "Pferd"], correct: 2 },
    { sequence: [31, 14, 56, 8, 22, 47], question: "Welche Zahl war die zweitkleinste?", options: ["8", "14", "22", "31"], correct: 1 },
    { sequence: ["N", "B", "7", "K", "3", "Q"], question: "Was kam direkt nach „7“?", options: ["N", "B", "K", "3"], correct: 2 },
    { sequence: ["⬆️", "➡️", "⬇️", "➡️", "⬆️", "➡️"], question: "Welche Richtung kam NICHT vor?", options: ["⬆️", "➡️", "⬇️", "⬅️"], correct: 3 },
  ],
}

const LEVEL_CONFIG = {
  1: { totalTime: 240, memorizeSeconds: 5, difficulty: "easy" },
  2: { totalTime: 210, memorizeSeconds: 4, difficulty: "medium" },
  3: { totalTime: 180, memorizeSeconds: 3, difficulty: "hard" },
}

export function MemoryExercise({ exerciseId = "memory", level = 1, onComplete, onBack }) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1]
  const QUESTIONS = useMemo(() => MEMORY_BANK[level] || MEMORY_BANK[1], [level])

  const [phase, setPhase] = useState("memorize")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(cfg.totalTime)
  const [startTime] = useState(Date.now())
  const [memoryTime, setMemoryTime] = useState(cfg.memorizeSeconds)

  useEffect(() => {
    setTimeLeft(cfg.totalTime)
    setMemoryTime(cfg.memorizeSeconds)
    setPhase("memorize")
    setCurrentQuestion(0)
    setScore(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level])

  useEffect(() => {
    if (phase === "memorize" && memoryTime > 0) {
      const timer = setTimeout(() => setMemoryTime((t) => t - 1), 1000)
      return () => clearTimeout(timer)
    } else if (phase === "memorize" && memoryTime === 0) {
      setPhase("question")
    }
  }, [phase, memoryTime])

  useEffect(() => {
    if (phase === "question") {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

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

    setPhase("result")
  }

  const handleAnswer = (index) => {
    if (index === QUESTIONS[currentQuestion].correct) {
      setScore((s) => s + 1)
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((q) => q + 1)
      setMemoryTime(cfg.memorizeSeconds)
      setPhase("memorize")
    } else {
      finishExercise()
    }
  }

  if (phase === "result") {
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
              <p className="text-sm text-muted-foreground">Gedächtnis – Level {level}</p>
              <p className="font-semibold">
                {currentQuestion + 1} / {QUESTIONS.length}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">{phase === "memorize" ? "Merken" : "Zeit"}</p>
            <p className="text-2xl font-bold tabular-nums">
              {phase === "memorize" ? memoryTime : `${minutes}:${seconds.toString().padStart(2, "0")}`}
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          {phase === "memorize" && (
            <>
              <p className="text-sm text-muted-foreground mb-2">Präge dir die Sequenz ein:</p>
              <CardTitle className="text-4xl md:text-5xl text-center font-mono font-bold flex flex-wrap gap-4 justify-center">
                {QUESTIONS[currentQuestion].sequence.map((item, idx) => (
                  <span key={idx}>{item}</span>
                ))}
              </CardTitle>
            </>
          )}

          {phase === "question" && (
            <CardTitle className="text-2xl text-balance leading-relaxed">{QUESTIONS[currentQuestion].question}</CardTitle>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-center">
          {phase === "memorize" ? (
            <p className="text-center text-muted-foreground">Bereit? Die Frage kommt gleich.</p>
          ) : (
            <>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
