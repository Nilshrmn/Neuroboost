"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RewardSummary } from "@/components/dashboard/reward-summary"
import { RiskRegister } from "@/components/dashboard/risk-register"
import { ArrowLeft, Award, Brain, Calendar, ShieldCheck, Target, TrendingUp, Zap } from "lucide-react"
import { getProgressToNextLevel } from "@/lib/level"
import { buildRewardMetrics } from "@/lib/rewards"
import { storage } from "@/lib/storage"

export function ProgressScreen({ onBack }) {
  const [stats, setStats] = useState({
    points: 0,
    level: 1,
    streak: 0,
    completedLevels: 0,
    attempts: 0,
    bestScore: 0,
    lastSafeSave: null,
  })

  useEffect(() => {
    const metrics = buildRewardMetrics()
    const lastSafeSave = storage.load("last_safe_save", null)

    setStats({
      points: metrics.points,
      level: metrics.level,
      streak: metrics.streak,
      completedLevels: metrics.completedLevels,
      attempts: metrics.attempts,
      bestScore: metrics.bestScore,
      lastSafeSave,
    })
  }, [])

  const levelProgress = getProgressToNextLevel(stats.points)
  const saveInfo = stats.lastSafeSave ? new Date(stats.lastSafeSave).toLocaleString("de-CH") : "Noch kein Safe-Save"

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-16">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Button>

        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Ihr Fortschritt</h1>
            <p className="text-muted-foreground">Verfolgen Sie Ihre Entwicklung</p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardDescription>Aktuelles Level</CardDescription>
                <CardTitle className="text-4xl">Level {stats.level}</CardTitle>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-chart-2/10">
                <Award className="h-7 w-7 text-chart-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fortschritt zum nächsten Level</span>
                <span className="font-semibold">{Math.round(levelProgress)}%</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardDescription>Streak</CardDescription>
                <CardTitle className="text-4xl">{stats.streak} Tage</CardTitle>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-chart-3/10">
                <Zap className="h-7 w-7 text-chart-3" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.streak > 0
                ? "Großartig! Bleiben Sie dran und trainieren Sie täglich."
                : "Starten Sie Ihre erste Übung, um Ihren Streak zu beginnen!"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Gesamtpunkte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-5xl font-bold">{stats.points}</div>
            <p className="text-muted-foreground">
              Verdienen Sie Punkte durch regelmäßiges Training und steigen Sie in den Leveln auf!
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Sicherer Fortschritt
            </CardTitle>
            <CardDescription>US-503: Daten werden zentral, versioniert und mit Backup gespeichert.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Letzter sicherer Speicherzeitpunkt: {saveInfo}</p>
            <p>
              Abgeschlossene Level: <span className="font-semibold text-foreground">{stats.completedLevels}</span> ·
              Versuche: <span className="font-semibold text-foreground">{stats.attempts}</span> · Beste Punktzahl:{" "}
              <span className="font-semibold text-foreground">{stats.bestScore}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <RewardSummary />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Gehirntraining</CardTitle>
            <CardDescription className="text-xs">
              Tägliche Übungen verbessern Ihre kognitiven Fähigkeiten
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Fortschritt</CardTitle>
            <CardDescription className="text-xs">Verfolgen Sie Ihre Entwicklung über Zeit</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Routine</CardTitle>
            <CardDescription className="text-xs">Bauen Sie eine tägliche Trainingsgewohnheit auf</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mb-8">
        <RiskRegister />
      </div>

      <div className="text-center">
        <Button size="lg" onClick={onBack}>
          Neue Übung starten
        </Button>
      </div>
    </div>
  )
}
