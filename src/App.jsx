"use client"

import { useEffect, useState } from "react"
import { StartScreen } from "@/components/start-screen"
import { CategorySelection } from "@/components/category-selection"
import { LevelSelection } from "@/components/level-selection"
import { ExerciseScreen } from "@/components/exercise-screen"
import { ProgressScreen } from "@/components/progress-screen"
import { AuthScreen } from "@/components/auth-screen"
import { Toaster } from "@/components/ui/toaster"
import { exercisesCatalog } from "@/lib/exercises-catalog"
import { storage } from "@/lib/storage"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("start")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(1)

  useEffect(() => {
    const user = storage.load("user")
    if (user) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleStartExercise = () => {
    setCurrentScreen("category")
  }

  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
    setSelectedExercise(null)
    storage.save("selected_category", category)
    setCurrentScreen("level-select")
  }

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise)
    setCurrentScreen("level-select")
  }

  const handleSelectLevel = (exercise, level) => {
    setSelectedExercise(exercise)
    setSelectedLevel(level)
    setCurrentScreen("exercise")
  }

  const handleRecommendedTraining = (recommendation) => {
    const levelMeta = exercisesCatalog[recommendation.category]?.find((item) => item.level === recommendation.level)

    setSelectedCategory(recommendation.category)
    setSelectedExercise({
      id: recommendation.category,
      category: recommendation.category,
      meta: levelMeta,
    })
    setSelectedLevel(recommendation.level)
    setCurrentScreen("exercise")
  }

  const handleExerciseComplete = () => {
    setCurrentScreen("progress")
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-background via-background to-primary/5 mobile-safe-area">
      {currentScreen === "start" && (
        <StartScreen
          onStartExercise={handleStartExercise}
          onViewProgress={() => setCurrentScreen("progress")}
          onAuth={() => setCurrentScreen("auth")}
          onRecommendedTraining={handleRecommendedTraining}
          isLoggedIn={isLoggedIn}
        />
      )}

      {currentScreen === "category" && (
        <CategorySelection onSelectCategory={handleSelectCategory} onBack={() => setCurrentScreen("start")} />
      )}

      {currentScreen === "level-select" && selectedCategory && (
        <LevelSelection
          category={selectedCategory}
          onSelectLevel={handleSelectLevel}
          onBack={() => setCurrentScreen("category")}
        />
      )}

      {currentScreen === "exercise" && selectedExercise && (
        <ExerciseScreen
          exercise={selectedExercise}
          level={selectedLevel}
          onComplete={handleExerciseComplete}
          onBack={() => setCurrentScreen("level-select")}
        />
      )}

      {currentScreen === "progress" && <ProgressScreen onBack={() => setCurrentScreen("start")} />}

      {currentScreen === "auth" && (
        <AuthScreen
          onBack={() => setCurrentScreen("start")}
          onSuccess={() => {
            setIsLoggedIn(true)
            setCurrentScreen("start")
          }}
        />
      )}

      <Toaster />
    </main>
  )
}
