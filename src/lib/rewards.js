import { storage } from "./storage"

export const REWARD_DEFINITIONS = [
  {
    id: "first-training",
    title: "Erstes Training",
    description: "Du hast deine erste Übung abgeschlossen.",
    icon: "🎉",
    isUnlocked: ({ attempts = 0 }) => attempts >= 1,
  },
  {
    id: "level-up",
    title: "Level-Up",
    description: "Du hast ein neues Nutzerlevel erreicht.",
    icon: "⬆️",
    isUnlocked: ({ level = 1 }) => level >= 2,
  },
  {
    id: "hundred-points",
    title: "100 Punkte",
    description: "Du hast die ersten 100 Punkte gesammelt.",
    icon: "🏅",
    isUnlocked: ({ points = 0 }) => points >= 100,
  },
  {
    id: "five-hundred-points",
    title: "500 Punkte",
    description: "Du bleibst dran und hast 500 Punkte erreicht.",
    icon: "🏆",
    isUnlocked: ({ points = 0 }) => points >= 500,
  },
  {
    id: "three-day-streak",
    title: "3-Tage-Streak",
    description: "Du hast an drei Tagen in Folge trainiert.",
    icon: "🔥",
    isUnlocked: ({ streak = 0 }) => streak >= 3,
  },
  {
    id: "seven-day-streak",
    title: "7-Tage-Streak",
    description: "Eine ganze Woche Training ohne Unterbruch.",
    icon: "⚡",
    isUnlocked: ({ streak = 0 }) => streak >= 7,
  },
  {
    id: "three-levels",
    title: "Level-Serie",
    description: "Du hast mindestens drei Level abgeschlossen.",
    icon: "🧠",
    isUnlocked: ({ completedLevels = 0 }) => completedLevels >= 3,
  },
  {
    id: "precision-master",
    title: "Präzisionsmeister",
    description: "Du hast eine Übung mit sehr hoher Leistung abgeschlossen.",
    icon: "🎯",
    isUnlocked: ({ bestScore = 0 }) => bestScore >= 80,
  },
]

const DEFAULT_REWARD_STATE = {
  unlocked: [],
  history: [],
}

function normalizeRewardState(state) {
  if (!state || typeof state !== "object") return DEFAULT_REWARD_STATE

  return {
    unlocked: Array.isArray(state.unlocked) ? state.unlocked : [],
    history: Array.isArray(state.history) ? state.history : [],
  }
}

function uniqueRewards(rewards) {
  return rewards.filter((reward, index, list) => list.findIndex((item) => item.id === reward.id) === index)
}

export function getRewardState() {
  return normalizeRewardState(storage.load("rewards", DEFAULT_REWARD_STATE))
}

export function getUnlockedRewardDetails() {
  const state = getRewardState()
  return REWARD_DEFINITIONS.filter((reward) => state.unlocked.includes(reward.id))
}

export function getRecentRewardUnlocks() {
  return storage.load("last_reward_unlocks", []) || []
}

export function resetRecentRewardUnlocks() {
  storage.save("last_reward_unlocks", [])
}

export function unlockRewards(metrics = {}) {
  const state = getRewardState()
  const unlockedIds = new Set(state.unlocked)
  const now = new Date().toISOString()

  const newlyUnlocked = REWARD_DEFINITIONS.filter((reward) => {
    if (unlockedIds.has(reward.id)) return false
    return reward.isUnlocked(metrics)
  })

  if (newlyUnlocked.length === 0) {
    return {
      state,
      newlyUnlocked: [],
    }
  }

  const nextState = {
    unlocked: [...state.unlocked, ...newlyUnlocked.map((reward) => reward.id)],
    history: [
      ...state.history,
      ...newlyUnlocked.map((reward) => ({
        id: reward.id,
        unlockedAt: now,
      })),
    ],
  }

  storage.save("rewards", nextState)

  const existingRecentUnlocks = getRecentRewardUnlocks()
  storage.save("last_reward_unlocks", uniqueRewards([...existingRecentUnlocks, ...newlyUnlocked]))

  return {
    state: nextState,
    newlyUnlocked,
  }
}

export function buildRewardMetrics(extraMetrics = {}) {
  const exerciseProgress = storage.load("exercise_progress", {}) || {}
  const progressEntries = Object.values(exerciseProgress)
  const completedLevels = progressEntries.reduce((sum, entry) => sum + (entry.levelsCompleted?.length || 0), 0)
  const attempts = progressEntries.reduce((sum, entry) => sum + (entry.attempts || 0), 0)
  const bestScore = progressEntries.reduce((best, entry) => {
    const scores = Object.values(entry.bestScores || {})
    const entryBest = scores.length > 0 ? Math.max(...scores) : 0
    return Math.max(best, entryBest)
  }, 0)

  return {
    points: Number(storage.load("points", 0)) || 0,
    level: Number(storage.load("level", 1)) || 1,
    streak: Number(storage.load("streak", 0)) || 0,
    completedLevels,
    attempts,
    bestScore,
    ...extraMetrics,
  }
}
