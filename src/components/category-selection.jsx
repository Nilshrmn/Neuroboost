"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Brain, Puzzle, Eye, Zap, Sparkles, Calculator } from "lucide-react"
import { getCategoryName } from "@/lib/exercises-catalog"

export function CategorySelection({ onSelectCategory, onBack }) {
  const categories = [
    {
      key: "memory",
      icon: Brain,
      description: "Trainiere dein Gedächtnis mit Merkaufgaben",
    },
    {
      key: "logic",
      icon: Puzzle,
      description: "Löse knifflige Logikrätsel",
    },
    {
      key: "concentration",
      icon: Eye,
      description: "Verbessere deine Konzentrationsfähigkeit",
    },
    {
      key: "reaction",
      icon: Zap,
      description: "Teste und verbessere deine Reaktionsgeschwindigkeit",
    },
    {
      key: "pattern",
      icon: Sparkles,
      description: "Erkenne und vervollständige Muster",
    },
    {
      key: "math",
      icon: Calculator,
      description: "Trainiere deine Rechenfähigkeiten",
    },
  ]

  return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Wähle eine Kategorie</h1>
          <p className="text-lg text-muted-foreground">
            Jede Kategorie enthält 3 Level – von leicht bis schwer
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
                <Card
                    key={category.key}
                    className="border-2 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => {
                      // 👉 Hier merken wir uns die gewählte Kategorie
                      localStorage.setItem("neuroboost_selected_category", category.key)
                      onSelectCategory(category.key)
                    }}
                >
                  <CardHeader>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{getCategoryName(category.key)}</CardTitle>
                    <CardDescription className="text-base">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <span>3 Levels</span>
                    </div>
                  </CardContent>
                </Card>
            )
          })}
        </div>
      </div>
  )
}
