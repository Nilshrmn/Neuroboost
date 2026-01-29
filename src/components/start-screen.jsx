"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Brain, TrendingUp, Zap, Target } from "lucide-react"
import { useEffect, useState } from "react"

export function StartScreen({ onStartExercise, onViewProgress, onAuth, isLoggedIn }) {
  const [stats, setStats] = useState({ points: 0, level: 1, streak: 0 })
  const [username, setUsername] = useState("")

  useEffect(() => {
    // Load user stats
    const points = Number.parseInt(localStorage.getItem("neuroboost_points") || "0")
    const level = Number.parseInt(localStorage.getItem("neuroboost_level") || "1")
    const streak = Number.parseInt(localStorage.getItem("neuroboost_streak") || "0")
    const user = localStorage.getItem("neuroboost_user")

    setStats({ points, level, streak })
    if (user) {
      const userData = JSON.parse(user)
      setUsername(userData.nickname)
    }
  }, [])

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-2xl">
            <Brain className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-balance">
          Neuro<span className="text-primary">Boost</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          Trainieren Sie Ihr Gehirn mit kurzen, effektiven Übungen. Verbessern Sie Konzentration, Gedächtnis und
          Kreativität in nur 3-5 Minuten täglich.
        </p>
      </div>

      {isLoggedIn && username && (
        <div className="mb-8 text-center">
          <p className="text-lg text-muted-foreground">
            Willkommen zurück, <span className="font-semibold text-foreground">{username}</span>!
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-chart-1" />
            </div>
            <CardTitle className="text-2xl">{stats.points}</CardTitle>
            <CardDescription>Punkte</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-chart-2" />
            </div>
            <CardTitle className="text-2xl">Level {stats.level}</CardTitle>
            <CardDescription>Aktuelles Level</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-chart-3" />
            </div>
            <CardTitle className="text-2xl">{stats.streak} Tage</CardTitle>
            <CardDescription>Streak</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <Button size="lg" className="w-full h-14 text-lg font-semibold" onClick={onStartExercise}>
          <Brain className="w-5 h-5 mr-2" />
          Training starten
        </Button>

        <Button variant="outline" size="lg" className="w-full h-14 text-lg bg-transparent" onClick={onViewProgress}>
          <TrendingUp className="w-5 h-5 mr-2" />
          Fortschritt anzeigen
        </Button>

        {!isLoggedIn && (
          <Button variant="ghost" size="lg" className="w-full h-14 text-lg" onClick={onAuth}>
            Anmelden / Registrieren
          </Button>
        )}
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Schnell & Effektiv</h3>
          <p className="text-sm text-muted-foreground">Nur 3-5 Minuten pro Übung</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Wissenschaftlich</h3>
          <p className="text-sm text-muted-foreground">Basierend auf Kognitionswissenschaft</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Motivierend</h3>
          <p className="text-sm text-muted-foreground">Gamification mit Levels & Streaks</p>
        </div>
      </div>
    </div>
  )
}
