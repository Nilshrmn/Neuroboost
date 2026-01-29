"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Trophy, Target } from "lucide-react"

export function ResultScreen({ score, total, onComplete, extraInfo }) {
  const percentage = Math.round((score / total) * 100)

  const getMessage = () => {
    if (percentage === 100) return "Perfekt!"
    if (percentage >= 80) return "Ausgezeichnet!"
    if (percentage >= 60) return "Gut gemacht!"
    if (percentage >= 40) return "Weiter so!"
    return "Übung macht den Meister!"
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 md:py-16 min-h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-primary/10 p-6 rounded-3xl">
              {percentage >= 80 ? (
                <Trophy className="w-16 h-16 text-primary" />
              ) : (
                <Brain className="w-16 h-16 text-primary" />
              )}
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2">{getMessage()}</h2>
          <p className="text-muted-foreground mb-8">Du hast die Übung abgeschlossen</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-md mx-auto mb-8">
            <div className="bg-muted/50 p-6 rounded-xl">
              <Target className="w-8 h-8 text-chart-1 mx-auto mb-2" />
              <p className="text-4xl font-bold mb-1">
                {score}/{total}
              </p>
              <p className="text-sm text-muted-foreground">Richtige Antworten</p>
            </div>

            <div className="bg-muted/50 p-6 rounded-xl">
              <Brain className="w-8 h-8 text-chart-2 mx-auto mb-2" />
              <p className="text-4xl font-bold mb-1">{percentage}%</p>
              <p className="text-sm text-muted-foreground">Genauigkeit</p>
            </div>
          </div>

          {extraInfo && <p className="text-sm text-muted-foreground mb-6">{extraInfo}</p>}

          <Button size="lg" className="w-full max-w-sm" onClick={onComplete}>
            Fortschritt anzeigen
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
