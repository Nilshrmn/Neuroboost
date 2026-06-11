"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Lightbulb, Sparkles, Target, Trophy } from "lucide-react"
import { getExerciseFeedback } from "@/lib/feedback"
import { getRecentRewardUnlocks } from "@/lib/rewards"

export function ResultScreen({ score, total, onComplete, extraInfo }) {
  const safeTotal = Math.max(Number(total) || 1, 1)
  const safeScore = Math.max(Number(score) || 0, 0)
  const percentage = Math.round((safeScore / safeTotal) * 100)
  const feedback = getExerciseFeedback({ score: safeScore, total: safeTotal })
  const newRewards = getRecentRewardUnlocks()

  const getMessage = () => {
    if (percentage === 100) return "Perfekt!"
    if (percentage >= 80) return "Ausgezeichnet!"
    if (percentage >= 60) return "Gut gemacht!"
    if (percentage >= 40) return "Weiter so!"
    return "Übung macht den Meister!"
  }

  return (
    <div className="container mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-8 sm:px-6 md:py-16">
      <Card className="w-full">
        <CardContent className="px-4 pb-10 pt-10 text-center sm:px-6 md:px-12 md:pb-12 md:pt-12">
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="rounded-3xl bg-primary/10 p-6">
              {percentage >= 80 ? <Trophy className="h-16 w-16 text-primary" /> : <Brain className="h-16 w-16 text-primary" />}
            </div>
          </div>

          <h2 className="mb-2 text-3xl font-bold">{getMessage()}</h2>
          <p className="mb-8 text-muted-foreground">Du hast die Übung abgeschlossen</p>

          <div className="mx-auto mb-8 grid max-w-md gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="rounded-xl bg-muted/50 p-6">
              <Target className="mx-auto mb-2 h-8 w-8 text-chart-1" />
              <p className="mb-1 text-4xl font-bold">
                {safeScore}/{safeTotal}
              </p>
              <p className="text-sm text-muted-foreground">Richtige Antworten</p>
            </div>

            <div className="rounded-xl bg-muted/50 p-6">
              <Brain className="mx-auto mb-2 h-8 w-8 text-chart-2" />
              <p className="mb-1 text-4xl font-bold">{percentage}%</p>
              <p className="text-sm text-muted-foreground">Genauigkeit</p>
            </div>
          </div>

          <div className="mx-auto mb-6 max-w-2xl rounded-xl border bg-muted/30 p-4 text-left">
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <p className="font-semibold">Sofortiges Feedback: {feedback.label}</p>
            </div>
            <p className="text-sm text-muted-foreground">{feedback.message}</p>
            <Badge variant="secondary" className="mt-3">
              Empfehlung: {feedback.nextStep}
            </Badge>
          </div>

          {newRewards.length > 0 && (
            <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-primary/30 bg-primary/5 p-4 text-left">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <Sparkles className="h-5 w-5 text-primary" />
                Neue Belohnung freigeschaltet
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {newRewards.map((reward) => (
                  <div key={reward.id} className="rounded-lg bg-background p-3">
                    <p className="font-semibold">
                      <span aria-hidden="true">{reward.icon}</span> {reward.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{reward.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {extraInfo && <p className="mb-6 text-sm text-muted-foreground">{extraInfo}</p>}

          <Button size="lg" className="w-full max-w-sm" onClick={onComplete}>
            Fortschritt anzeigen
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
