import { buildRewardMetrics, unlockRewards } from "./rewards"
import { storage } from "./storage"

const DEFAULT_EXERCISE_PROGRESS = {
  levelsCompleted: [],
  bestScores: {},
  attempts: 0,
  lastPlayed: 0,
}

function normalizeLevel(level) {
  const parsedLevel = Number.parseInt(level, 10)
  return Number.isFinite(parsedLevel) && parsedLevel > 0 ? parsedLevel : 1
}

function normalizeScore(score) {
  const parsedScore = Number(score)
  return Number.isFinite(parsedScore) && parsedScore > 0 ? Math.round(parsedScore) : 0
}

function createDefaultExerciseProgress(exerciseId) {
  return {
    exerciseId,
    ...DEFAULT_EXERCISE_PROGRESS,
  }
}

function normalizeExerciseProgress(exerciseId, progress) {
  const safeProgress = progress && typeof progress === "object" ? progress : {}

  return {
    exerciseId,
    levelsCompleted: Array.isArray(safeProgress.levelsCompleted) ? safeProgress.levelsCompleted : [],
    bestScores: safeProgress.bestScores && typeof safeProgress.bestScores === "object" ? safeProgress.bestScores : {},
    attempts: Number.isFinite(Number(safeProgress.attempts)) ? Number(safeProgress.attempts) : 0,
    lastPlayed: Number.isFinite(Number(safeProgress.lastPlayed)) ? Number(safeProgress.lastPlayed) : 0,
  }
}

export const progressManager = {
  // Get progress for a specific exercise
  getExerciseProgress(exerciseId) {
    const progress = storage.load("exercise_progress", {}) || {}
    return normalizeExerciseProgress(exerciseId, progress[exerciseId] || createDefaultExerciseProgress(exerciseId))
  },

  // Save progress for an exercise level
  completeLevel(exerciseId, level, score) {
    const safeLevel = normalizeLevel(level)
    const safeScore = normalizeScore(score)
    const allProgress = storage.load("exercise_progress", {}) || {}
    const exerciseProgress = normalizeExerciseProgress(
      exerciseId,
      allProgress[exerciseId] || createDefaultExerciseProgress(exerciseId),
    )

    // Add level to completed if not already there
    if (!exerciseProgress.levelsCompleted.includes(safeLevel)) {
      exerciseProgress.levelsCompleted.push(safeLevel)
      exerciseProgress.levelsCompleted.sort((a, b) => a - b)
    }

    // Update best score
    if (!exerciseProgress.bestScores[safeLevel] || safeScore > exerciseProgress.bestScores[safeLevel]) {
      exerciseProgress.bestScores[safeLevel] = safeScore
    }

    exerciseProgress.attempts++
    exerciseProgress.lastPlayed = Date.now()

    allProgress[exerciseId] = exerciseProgress
    storage.save("exercise_progress", allProgress)

    unlockRewards(buildRewardMetrics({ bestScore: safeScore }))

    return exerciseProgress
  },

  // Check if a level is unlocked
  isLevelUnlocked(exerciseId, level) {
    const safeLevel = normalizeLevel(level)
    if (safeLevel === 1) return true // First level always unlocked

    const progress = this.getExerciseProgress(exerciseId)
    // Level is unlocked if previous level is completed
    return progress.levelsCompleted.includes(safeLevel - 1)
  },

  // Get category progress
  getCategoryProgress(category, exercises) {
    const allProgress = storage.load("exercise_progress", {}) || {}

    let completedExercises = 0
    let completedLevels = 0
    const totalExercises = exercises.length
    const totalLevels = exercises.length * 5

    exercises.forEach((exercise) => {
      const progress = normalizeExerciseProgress(exercise.id, allProgress[exercise.id])
      if (progress.attempts > 0 || progress.levelsCompleted.length > 0) {
        completedLevels += progress.levelsCompleted.length
        // Exercise is completed if all 5 levels are done
        if (progress.levelsCompleted.length === 5) {
          completedExercises++
        }
      }
    })

    return {
      category,
      totalExercises,
      completedExercises,
      totalLevels,
      completedLevels,
    }
  },

  // Reset progress for an exercise
  resetExercise(exerciseId) {
    const allProgress = storage.load("exercise_progress", {}) || {}
    delete allProgress[exerciseId]
    storage.save("exercise_progress", allProgress)
  },
}
