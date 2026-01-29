"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lock, CheckCircle2, Star, TrendingUp } from "lucide-react"
import { progressManager } from "@/lib/progress"
import { useEffect, useState } from "react"
import { exercisesCatalog, getCategoryName } from "@/lib/exercises-catalog"

const DIFFICULTY_LABELS = ["Leicht", "Mittel", "Schwer"]
const DIFFICULTY_COLORS = ["text-green-600", "text-yellow-600", "text-red-600"]

export function LevelSelection({ category, onSelectLevel, onBack }) {
  const [exerciseProgress, setExerciseProgress] = useState(null)

  const levels = exercisesCatalog[category] || []

  useEffect(() => {
    setExerciseProgress(progressManager.getExerciseProgress(category))
  }, [category])

  const completedLevels = exerciseProgress?.levelsCompleted?.length || 0
  const totalLevels = levels.length || 3

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Zurück
      </Button>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{getCategoryName(category)}</h1>
        <p className="text-lg text-muted-foreground mb-4">3 Level – von leicht bis schwer</p>

        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="text-base px-4 py-1">
            {completedLevels} / {totalLevels} abgeschlossen
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Schwierigkeit steigt progressiv</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((meta, idx) => {
          const level = meta.level ?? idx + 1
          const isUnlocked = progressManager.isLevelUnlocked(category, level)
          const isCompleted = exerciseProgress?.levelsCompleted?.includes(level) || false
          const bestScore = exerciseProgress?.bestScores?.[level] || 0

          return (
            <Card
              key={`${category}-level-${level}`}
              className={`border-2 transition-all ${
                !isUnlocked ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 hover:shadow-lg cursor-pointer"
              } ${isCompleted ? "border-green-500/30 bg-green-500/5" : ""}`}
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
                <div className="flex items-center justify-between mb-2">
                  <div className="text-4xl mb-2">{meta.icon}</div>
                  {!isUnlocked && <Lock className="w-6 h-6 text-muted-foreground" />}
                  {isCompleted && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                </div>

                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-xl font-bold">Level {level}</CardTitle>
                  <Badge variant="outline" className={`text-xs ${DIFFICULTY_COLORS[Math.min(idx, 2)]}`}>
                    {DIFFICULTY_LABELS[Math.min(idx, 2)]}
                  </Badge>
                </div>

                <p className="text-sm font-medium text-muted-foreground">{meta.name}</p>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{meta.description}</p>

                {isCompleted && bestScore > 0 && (
                  <div className="flex items-center gap-2 text-sm mt-3 pt-3 border-t">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Beste Punktzahl: {bestScore}</span>
                  </div>
                )}

                {!isUnlocked && (
                  <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
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
