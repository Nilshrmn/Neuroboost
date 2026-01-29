"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lock, CheckCircle2, Clock } from "lucide-react"
import { exercisesCatalog, getCategoryName } from "@/lib/exercises-catalog"
import { progressManager } from "@/lib/progress"
import { useEffect, useState } from "react"

export function ExerciseSelection({ category, onSelectExercise, onBack }) {
  const [exercises] = useState(exercisesCatalog[category])
  const [categoryProgress, setCategoryProgress] = useState({ completedExercises: 0, completedLevels: 0 })

  useEffect(() => {
    const progress = progressManager.getCategoryProgress(category, exercises)
    setCategoryProgress({
      completedExercises: progress.completedExercises,
      completedLevels: progress.completedLevels,
    })
  }, [category, exercises])

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Zurück
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{getCategoryName(category)}</h1>
        <div className="flex items-center justify-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{categoryProgress.completedExercises} / 10 Übungen</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{categoryProgress.completedLevels} / 50 Levels</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise, index) => {
          const progress = progressManager.getExerciseProgress(exercise.id)
          const completedLevels = progress.levelsCompleted.length
          const isCompleted = completedLevels === 5
          const isLocked =
            index > 0 && progressManager.getExerciseProgress(exercises[index - 1].id).levelsCompleted.length === 0

          return (
            <Card
              key={exercise.id}
              className={`border-2 transition-all ${
                isLocked ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 hover:shadow-lg cursor-pointer"
              } ${isCompleted ? "border-green-500/30 bg-green-500/5" : ""}`}
              onClick={() => !isLocked && onSelectExercise(exercise)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{exercise.icon}</div>
                  {isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </div>
                <CardTitle className="text-xl">{exercise.name}</CardTitle>
                <CardDescription>{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={isCompleted ? "default" : "secondary"}>{completedLevels} / 5 Levels</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(exercise.duration / 60)} Min</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        progress.levelsCompleted.includes(level) ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
