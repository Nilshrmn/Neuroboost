"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ShieldCheck } from "lucide-react"
import { PROJECT_RISKS } from "@/lib/project-risks"

export function RiskRegister() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Projektrisiken
        </CardTitle>
        <CardDescription>Kritische Risiken sind dokumentiert und priorisiert.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {PROJECT_RISKS.map((risk) => (
          <div key={risk.id} className="rounded-xl border p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant={risk.priority === "Hoch" ? "default" : "secondary"}>{risk.priority}</Badge>
                  <span className="text-sm font-semibold">{risk.id}</span>
                </div>
                <p className="font-semibold">{risk.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{risk.mitigation}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground sm:text-right">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  Eintritt {risk.probability} / Auswirkung {risk.impact}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
