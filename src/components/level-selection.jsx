"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lock, CheckCircle2, Star, TrendingUp, Sparkles } from "lucide-react"
import { progressManager } from "@/lib/progress"
import { exercisesCatalog, getCategoryName } from "@/lib/exercises-catalog"
import { getPersonalizedRecommendation } from "@/lib/personalization"

const DIFFICULTY_LABELS = ["Leicht", "Mittel", "Schwer"]
const DIFFICULTY_COLORS = ["text-green-600", "text-yellow-600", "text-red-600"]

export function LevelSelection({ category, onSelectLevel, onBack }) {
  const [exerciseProgress, setExerciseProgress] = useState(null)

  const levels = exercisesCatalog[category] || []
  const recommendation = useMemo(() => getPersonalizedRecommendation(), [])

  useEffect(() => {
    setExerciseProgress(progressManager.getExerciseProgress(category))
  }, [category])

  const completedLevels = exerciseProgress?.levelsCompleted?.length || 0
  const totalLevels = levels.length || 3

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="h-4 w-4" />
        Zurück
      </Button>

      <div className="mb-10 text-center md:mb-12">
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl md:text-5xl">{getCategoryName(category)}</h1>
        <p className="mb-4 text-lg text-muted-foreground">3 Level – von leicht bis schwer</p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Badge variant="secondary" className="px-4 py-1 text-base">
            {completedLevels} / {totalLevels} abgeschlossen
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Schwierigkeit steigt progressiv</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {levels.map((meta, idx) => {
          const level = meta.level ?? idx + 1
          const isUnlocked = progressManager.isLevelUnlocked(category, level)
          const isCompleted = exerciseProgress?.levelsCompleted?.includes(level) || false
          const bestScore = exerciseProgress?.bestScores?.[level] || 0
          const isRecommended = recommendation?.category === category && recommendation?.level === level

          return (
            <Card
              key={`${category}-level-${level}`}
              className={`border-2 transition-all ${
                !isUnlocked ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 hover:shadow-lg cursor-pointer"
              } ${isCompleted ? "border-green-500/30 bg-green-500/5" : ""} ${
                isRecommended ? "border-primary/50 bg-primary/5" : ""
              }`}
              onClick={() =>
                isUnlocked &&
                onSelectLevel(
                  {
                    id: category,
                    category,
                    meta,
                  },
                  level,
                )
              }
            >
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="mb-2 text-4xl">{meta.icon}</div>
                  <div className="flex items-center gap-2">
                    {isRecommended && <Sparkles className="h-6 w-6 text-primary" />}
                    {!isUnlocked && <Lock className="h-6 w-6 text-muted-foreground" />}
                    {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                  </div>
                </div>

                <div className="mb-1 flex items-center justify-between gap-3">
                  <CardTitle className="text-xl font-bold">Level {level}</CardTitle>
                  <Badge variant="outline" className={`text-xs ${DIFFICULTY_COLORS[Math.min(idx, 2)]}`}>
                    {DIFFICULTY_LABELS[Math.min(idx, 2)]}
                  </Badge>
                </div>

                <p className="text-sm font-medium text-muted-foreground">{meta.name}</p>
              </CardHeader>

              <CardContent>
                {isRecommended && (
                  <Badge variant="secondary" className="mb-3">
                    Empfohlen für dich
                  </Badge>
                )}

                <p className="mb-2 text-sm text-muted-foreground">{meta.description}</p>

                {isCompleted && bestScore > 0 && (
                  <div className="mt-3 flex items-center gap-2 border-t pt-3 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Beste Punktzahl: {bestScore}</span>
                  </div>
                )}

                {!isUnlocked && (
                  <p className="mt-3 border-t pt-3 text-sm text-muted-foreground">
                    Schließe Level {level - 1} ab, um freizuschalten
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
