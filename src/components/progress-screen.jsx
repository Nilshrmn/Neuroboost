"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Award, Brain, Calendar, Target, TrendingUp, Zap } from "lucide-react"

export function ProgressScreen({ onBack }) {
  const [stats, setStats] = useState({
    points: 0,
    level: 1,
    streak: 0,
    nextLevelPoints: 100,
  })

  useEffect(() => {
    const points = Number.parseInt(localStorage.getItem("neuroboost_points") || "0")
    const level = Number.parseInt(localStorage.getItem("neuroboost_level") || "1")
    const streak = Number.parseInt(localStorage.getItem("neuroboost_streak") || "0")
    const nextLevelPoints = level * 100

    setStats({ points, level, streak, nextLevelPoints })
  }, [])

  const levelProgress = ((stats.points % 100) / 100) * 100

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-16">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>

        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Ihr Fortschritt</h1>
            <p className="text-muted-foreground">Verfolgen Sie Ihre Entwicklung</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Aktuelles Level</CardDescription>
                <CardTitle className="text-4xl">Level {stats.level}</CardTitle>
              </div>
              <div className="w-14 h-14 rounded-full bg-chart-2/10 flex items-center justify-center">
                <Award className="w-7 h-7 text-chart-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fortschritt zum nächsten Level</span>
                <span className="font-semibold">{stats.points % 100} / 100</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Streak</CardDescription>
                <CardTitle className="text-4xl">{stats.streak} Tage</CardTitle>
              </div>
              <div className="w-14 h-14 rounded-full bg-chart-3/10 flex items-center justify-center">
                <Zap className="w-7 h-7 text-chart-3" />
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

      <Card className="mb-8 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Gesamtpunkte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold mb-4">{stats.points}</div>
          <p className="text-muted-foreground">
            Verdienen Sie Punkte durch regelmäßiges Training und steigen Sie in den Leveln auf!
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Gehirntraining</CardTitle>
            <CardDescription className="text-xs">
              Tägliche Übungen verbessern Ihre kognitiven Fähigkeiten
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Fortschritt</CardTitle>
            <CardDescription className="text-xs">Verfolgen Sie Ihre Entwicklung über Zeit</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Routine</CardTitle>
            <CardDescription className="text-xs">Bauen Sie eine tägliche Trainingsgewohnheit auf</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button size="lg" onClick={onBack}>
          Neue Übung starten
        </Button>
      </div>
    </div>
  )
}
