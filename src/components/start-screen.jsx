"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Brain, TrendingUp, Zap, Target } from "lucide-react"
import { PersonalizedTrainingCard } from "@/components/dashboard/personalized-training-card"
import { RewardSummary } from "@/components/dashboard/reward-summary"
import { getPersonalizedRecommendation } from "@/lib/personalization"
import { storage } from "@/lib/storage"

export function StartScreen({ onStartExercise, onViewProgress, onAuth, onRecommendedTraining, isLoggedIn }) {
  const [stats, setStats] = useState({ points: 0, level: 1, streak: 0 })
  const [username, setUsername] = useState("")
  const [recommendation, setRecommendation] = useState(null)

  useEffect(() => {
    const points = Number.parseInt(storage.load("points", 0) || "0")
    const level = Number.parseInt(storage.load("level", 1) || "1")
    const streak = Number.parseInt(storage.load("streak", 0) || "0")
    const user = storage.load("user")

    setStats({ points, level, streak })
    setRecommendation(getPersonalizedRecommendation())

    if (user) {
      setUsername(user.nickname)
    }
  }, [])

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-16">
      <div className="mb-10 text-center md:mb-12">
        <div className="mb-6 inline-flex items-center justify-center">
          <div className="rounded-2xl bg-primary/10 p-4">
            <Brain className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="mb-4 text-balance text-4xl font-bold sm:text-5xl md:text-7xl">
          Neuro<span className="text-primary">Boost</span>
        </h1>
        <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
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

      <div className="mb-8 grid gap-4 md:grid-cols-3 md:gap-4">
        <Card className="border-2 transition-colors hover:border-primary/50">
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
              <Target className="h-5 w-5 text-chart-1" />
            </div>
            <CardTitle className="text-2xl">{stats.points}</CardTitle>
            <CardDescription>Punkte</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 transition-colors hover:border-primary/50">
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
              <TrendingUp className="h-5 w-5 text-chart-2" />
            </div>
            <CardTitle className="text-2xl">Level {stats.level}</CardTitle>
            <CardDescription>Aktuelles Level</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 transition-colors hover:border-primary/50">
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
              <Zap className="h-5 w-5 text-chart-3" />
            </div>
            <CardTitle className="text-2xl">{stats.streak} Tage</CardTitle>
            <CardDescription>Streak</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mb-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <PersonalizedTrainingCard recommendation={recommendation} onStart={onRecommendedTraining} />
        <RewardSummary compact />
      </div>

      <div className="mx-auto max-w-md space-y-4">
        <Button size="lg" className="h-14 w-full text-lg font-semibold" onClick={onStartExercise}>
          <Brain className="h-5 w-5" />
          Training starten
        </Button>

        <Button variant="outline" size="lg" className="h-14 w-full bg-transparent text-lg" onClick={onViewProgress}>
          <TrendingUp className="h-5 w-5" />
          Fortschritt anzeigen
        </Button>

        {!isLoggedIn && (
          <Button variant="ghost" size="lg" className="h-14 w-full text-lg" onClick={onAuth}>
            Anmelden / Registrieren
          </Button>
        )}
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold">Schnell & Effektiv</h3>
          <p className="text-sm text-muted-foreground">Nur 3-5 Minuten pro Übung</p>
        </div>

        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold">Personalisiert</h3>
          <p className="text-sm text-muted-foreground">Empfehlungen passen sich deinem Niveau an</p>
        </div>

        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold">Motivierend</h3>
          <p className="text-sm text-muted-foreground">Belohnungen, Levels und Streaks halten dich dran</p>
        </div>
      </div>
    </div>
  )
}
