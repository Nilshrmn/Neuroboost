import { exercisesCatalog, getCategoryName } from "./exercises-catalog"
import { storage } from "./storage"

function getProgressForCategory(category) {
  const allProgress = storage.load("exercise_progress", {}) || {}
  return (
    allProgress[category] || {
      exerciseId: category,
      levelsCompleted: [],
      bestScores: {},
      attempts: 0,
      lastPlayed: 0,
    }
  )
}

function getRecommendedLevel(categoryProgress, levelCount) {
  const completedLevels = categoryProgress.levelsCompleted || []
  const sortedCompletedLevels = [...completedLevels].sort((a, b) => a - b)
  const highestCompletedLevel = sortedCompletedLevels[sortedCompletedLevels.length - 1] || 0
  const nextLevel = Math.min(highestCompletedLevel + 1, levelCount)
  const bestScore = categoryProgress.bestScores?.[highestCompletedLevel] || 0

  if (highestCompletedLevel > 0 && bestScore < 60) {
    return highestCompletedLevel
  }

  return Math.max(nextLevel, 1)
}

export function getPersonalizedRecommendation() {
  const categories = Object.keys(exercisesCatalog)
  const rankedCategories = categories
    .map((category) => {
      const progress = getProgressForCategory(category)
      const levelCount = exercisesCatalog[category]?.length || 1
      const completedCount = progress.levelsCompleted?.length || 0
      const completionRatio = completedCount / levelCount

      return {
        category,
        progress,
        levelCount,
        completionRatio,
        lastPlayed: progress.lastPlayed || 0,
      }
    })
    .sort((a, b) => {
      if (a.completionRatio !== b.completionRatio) {
        return a.completionRatio - b.completionRatio
      }

      return a.lastPlayed - b.lastPlayed
    })

  const selected = rankedCategories[0]
  const level = getRecommendedLevel(selected.progress, selected.levelCount)
  const completedCount = selected.progress.levelsCompleted?.length || 0
  const categoryName = getCategoryName(selected.category)

  return {
    category: selected.category,
    categoryName,
    level,
    title: `${categoryName} – Level ${level}`,
    reason:
      completedCount === 0
        ? "Diese Kategorie wurde noch nicht trainiert und ist ein guter nächster Schritt."
        : "Diese Kategorie hat aktuell den grössten Nutzen für deinen Fortschritt.",
  }
}
