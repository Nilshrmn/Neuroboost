import { storage } from "./storage"

export const progressManager = {
  // Get progress for a specific exercise
  getExerciseProgress(exerciseId) {
    const progress = storage.load("exercise_progress") || {}
    return (
      progress[exerciseId] || {
        exerciseId,
        levelsCompleted: [],
        bestScores: {},
        attempts: 0,
        lastPlayed: 0,
      }
    )
  },

  // Save progress for an exercise level
  completeLevel(exerciseId, level, score) {
    const allProgress = storage.load("exercise_progress") || {}
    const exerciseProgress = allProgress[exerciseId] || {
      exerciseId,
      levelsCompleted: [],
      bestScores: {},
      attempts: 0,
      lastPlayed: 0,
    }

    // Add level to completed if not already there
    if (!exerciseProgress.levelsCompleted.includes(level)) {
      exerciseProgress.levelsCompleted.push(level)
      exerciseProgress.levelsCompleted.sort((a, b) => a - b)
    }

    // Update best score
    if (!exerciseProgress.bestScores[level] || score > exerciseProgress.bestScores[level]) {
      exerciseProgress.bestScores[level] = score
    }

    exerciseProgress.attempts++
    exerciseProgress.lastPlayed = Date.now()

    allProgress[exerciseId] = exerciseProgress
    storage.save("exercise_progress", allProgress)

    return exerciseProgress
  },

  // Check if a level is unlocked
  isLevelUnlocked(exerciseId, level) {
    if (level === 1) return true // First level always unlocked

    const progress = this.getExerciseProgress(exerciseId)
    // Level is unlocked if previous level is completed
    return progress.levelsCompleted.includes(level - 1)
  },

  // Get category progress
  getCategoryProgress(category, exercises) {
    const allProgress = storage.load("exercise_progress") || {}

    let completedExercises = 0
    let completedLevels = 0
    const totalExercises = exercises.length
    const totalLevels = exercises.length * 5

    exercises.forEach((exercise) => {
      const progress = allProgress[exercise.id]
      if (progress) {
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
    const allProgress = storage.load("exercise_progress") || {}
    delete allProgress[exerciseId]
    storage.save("exercise_progress", allProgress)
  },
}
