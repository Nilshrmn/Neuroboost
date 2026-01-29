export const LEVELS = [
  { level: 1, name: "Anfänger", pointsRequired: 0, description: "Erste Schritte im Gehirntraining" },
  { level: 2, name: "Lernender", pointsRequired: 100, description: "Du machst Fortschritte!" },
  { level: 3, name: "Trainierter", pointsRequired: 250, description: "Solide Grundlagen" },
  { level: 4, name: "Fortgeschritten", pointsRequired: 500, description: "Beeindruckende Leistung" },
  { level: 5, name: "Experte", pointsRequired: 1000, description: "Hervorragendes Training" },
  { level: 6, name: "Meister", pointsRequired: 2000, description: "Außergewöhnliche Fähigkeiten" },
  { level: 7, name: "Champion", pointsRequired: 3500, description: "Elite-Gehirntrainer" },
  { level: 8, name: "Legende", pointsRequired: 5000, description: "Legendärer Status erreicht" },
]

export function getLevelByPoints(points) {
  let currentLevel = LEVELS[0]

  for (const level of LEVELS) {
    if (points >= level.pointsRequired) {
      currentLevel = level
    } else {
      break
    }
  }

  return currentLevel
}

export function getNextLevel(currentLevel) {
  const nextLevelIndex = LEVELS.findIndex((l) => l.level === currentLevel + 1)
  return nextLevelIndex !== -1 ? LEVELS[nextLevelIndex] : null
}

export function getProgressToNextLevel(points) {
  const currentLevel = getLevelByPoints(points)
  const nextLevel = getNextLevel(currentLevel.level)

  if (!nextLevel) return 100

  const pointsInCurrentLevel = points - currentLevel.pointsRequired
  const pointsNeededForNextLevel = nextLevel.pointsRequired - currentLevel.pointsRequired

  return Math.min(100, (pointsInCurrentLevel / pointsNeededForNextLevel) * 100)
}
