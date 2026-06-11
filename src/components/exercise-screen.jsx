"use client"

import { Button } from "@/components/ui/button"

import { MemoryExercise } from "@/components/exercises/memory-exercise"
import { LogicExercise } from "@/components/exercises/logic-exercise"
import { ConcentrationExercise } from "@/components/exercises/concentration-exercise"
import { ReactionExercise } from "@/components/exercises/reaction-exercise"
import { PatternExercise } from "@/components/exercises/pattern-exercise"
import { MathExercise } from "@/components/exercises/math-exercise"

const EXERCISE_TYPES = [
  { id: "memory", component: MemoryExercise },
  { id: "logic", component: LogicExercise },
  { id: "concentration", component: ConcentrationExercise },
  { id: "reaction", component: ReactionExercise },
  { id: "pattern", component: PatternExercise },
  { id: "math", component: MathExercise },
]

export function ExerciseScreen({ exercise, level = 1, onComplete, onBack }) {
  const category = exercise?.category || exercise?.id

  const ExerciseComponent = EXERCISE_TYPES.find((e) => e.id === category)?.component

  if (!ExerciseComponent) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 md:py-16">
        <p className="mb-4 text-center text-muted-foreground">
          Es konnte keine passende Übung für diese Kategorie gefunden werden.
        </p>
        <div className="flex justify-center">
          <Button onClick={onBack}>Zurück</Button>
        </div>
      </div>
    )
  }

  return (
    <ExerciseComponent exerciseId={category} level={level} onComplete={onComplete} onBack={onBack} meta={exercise?.meta} />
  )
}
