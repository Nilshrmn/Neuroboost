import { storage } from "./storage"

export function calculatePoints(result) {
  const basePoints = result.correct * 10

  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }[result.difficulty]

  const avgTimePerQuestion = result.timeSpent / result.total
  const timeBonus = avgTimePerQuestion < 5 ? 1.2 : avgTimePerQuestion < 10 ? 1.1 : 1

  const accuracy = result.correct / result.total
  const accuracyBonus = accuracy === 1 ? 1.5 : accuracy >= 0.8 ? 1.2 : 1

  return Math.round(basePoints * difficultyMultiplier * timeBonus * accuracyBonus)
}

export function updateUserProgress(earnedPoints) {
  const currentPoints = Number.parseInt(storage.load("points") || "0")
  const currentLevel = Number.parseInt(storage.load("level") || "1")
  const totalPoints = currentPoints + earnedPoints

  storage.save("points", totalPoints)

  const newLevel = Math.floor(totalPoints / 100) + 1
  const levelUp = newLevel > currentLevel

  if (levelUp) {
    storage.save("level", newLevel)
  }

  return { totalPoints, levelUp, newLevel }
}

export function updateStreak() {
  const lastPlayed = storage.load("last_played")
  const today = new Date().toDateString()

  if (lastPlayed === today) {
    return Number.parseInt(storage.load("streak") || "0")
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  let streak = Number.parseInt(storage.load("streak") || "0")

  if (lastPlayed === yesterdayStr) {
    streak++
  } else if (lastPlayed && lastPlayed !== today) {
    streak = 1
  } else {
    streak = streak || 1
  }

  storage.save("streak", streak)
  storage.save("last_played", today)

  return streak
}
