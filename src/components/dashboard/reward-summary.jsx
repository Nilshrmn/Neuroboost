"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Gift } from "lucide-react"
import { getUnlockedRewardDetails, REWARD_DEFINITIONS } from "@/lib/rewards"

export function RewardSummary({ compact = false }) {
  const unlockedRewards = getUnlockedRewardDetails()
  const unlockedIds = new Set(unlockedRewards.map((reward) => reward.id))
  const visibleRewards = compact ? REWARD_DEFINITIONS.slice(0, 4) : REWARD_DEFINITIONS

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Belohnungen
            </CardTitle>
            <CardDescription>
              {unlockedRewards.length} / {REWARD_DEFINITIONS.length} Erfolge freigeschaltet
            </CardDescription>
          </div>
          <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:flex">
            <Gift className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleRewards.map((reward) => {
            const isUnlocked = unlockedIds.has(reward.id)

            return (
              <div
                key={reward.id}
                className={`rounded-xl border p-3 transition-colors ${
                  isUnlocked ? "border-primary/40 bg-primary/5" : "bg-muted/40 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {reward.icon}
                    </span>
                    <div>
                      <p className="font-semibold leading-none">{reward.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                  <Badge variant={isUnlocked ? "default" : "secondary"}>{isUnlocked ? "Aktiv" : "Offen"}</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
