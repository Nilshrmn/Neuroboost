"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Target } from "lucide-react"

export function PersonalizedTrainingCard({ recommendation, onStart }) {
  if (!recommendation) return null

  return (
    <Card className="border-2 border-primary/30 bg-primary/5">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-3">
              Personalisiert
            </Badge>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-5 w-5 text-primary" />
              Empfohlenes Training
            </CardTitle>
            <CardDescription className="mt-2">{recommendation.reason}</CardDescription>
          </div>
          <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-background sm:flex">
            <Target className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold">{recommendation.title}</p>
          <p className="text-sm text-muted-foreground">Passt zu deinem aktuellen Fortschritt.</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => onStart(recommendation)}>
          Jetzt starten
        </Button>
      </CardContent>
    </Card>
  )
}
