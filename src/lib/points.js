import { buildRewardMetrics, resetRecentRewardUnlocks, unlockRewards } from "./rewards"
import { storage } from "./storage"

export function calculatePoints(result) {
  const total = Math.max(Number(result.total) || 1, 1)
  const correct = Math.max(Number(result.correct) || 0, 0)
  const timeSpent = Math.max(Number(result.timeSpent) || 0, 1)
  const basePoints = correct * 10

  const difficultyMultiplier =
    {
      easy: 1,
      medium: 1.5,
      hard: 2,
    }[result.difficulty] || 1

  const avgTimePerQuestion = timeSpent / total
  const timeBonus = avgTimePerQuestion < 5 ? 1.2 : avgTimePerQuestion < 10 ? 1.1 : 1

  const accuracy = correct / total
  const accuracyBonus = accuracy === 1 ? 1.5 : accuracy >= 0.8 ? 1.2 : 1

  return Math.round(basePoints * difficultyMultiplier * timeBonus * accuracyBonus)
}

export function updateUserProgress(earnedPoints) {
  const safeEarnedPoints = Math.max(Number(earnedPoints) || 0, 0)
  const currentPoints = Number.parseInt(storage.load("points", 0) || "0")
  const currentLevel = Number.parseInt(storage.load("level", 1) || "1")
  const totalPoints = currentPoints + safeEarnedPoints

  resetRecentRewardUnlocks()
  storage.save("points", totalPoints)

  const newLevel = Math.floor(totalPoints / 100) + 1
  const levelUp = newLevel > currentLevel

  if (levelUp) {
    storage.save("level", newLevel)
  }

  const rewardResult = unlockRewards(
    buildRewardMetrics({
      points: totalPoints,
      earnedPoints: safeEarnedPoints,
      level: newLevel,
      previousLevel: currentLevel,
    }),
  )

  return {
    totalPoints,
    levelUp,
    newLevel,
    newRewards: rewardResult.newlyUnlocked,
  }
}

export function updateStreak() {
  const lastPlayed = storage.load("last_played")
  const today = new Date().toDateString()

  if (lastPlayed === today) {
    return Number.parseInt(storage.load("streak", 0) || "0")
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  let streak = Number.parseInt(storage.load("streak", 0) || "0")

  if (lastPlayed === yesterdayStr) {
    streak++
  } else if (lastPlayed && lastPlayed !== today) {
    streak = 1
  } else {
    streak = streak || 1
  }

  storage.save("streak", streak)
  storage.save("last_played", today)
  unlockRewards(buildRewardMetrics({ streak }))

  return streak
}
