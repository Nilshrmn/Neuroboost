"use client"

import { useState, useEffect } from "react"
import { StartScreen } from "@/components/start-screen"
import { CategorySelection } from "@/components/category-selection"
import { LevelSelection } from "@/components/level-selection"
import { ExerciseScreen } from "@/components/exercise-screen"
import { ProgressScreen } from "@/components/progress-screen"
import { AuthScreen } from "@/components/auth-screen"
import { Toaster } from "@/components/ui/toaster"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("start")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(1)

  useEffect(() => {
    const user = localStorage.getItem("neuroboost_user")
    if (user) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleStartExercise = () => {
    setCurrentScreen("category")
  }

  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
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

  const handleExerciseComplete = () => {
    setCurrentScreen("level-select")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {currentScreen === "start" && (
        <StartScreen
          onStartExercise={handleStartExercise}
          onViewProgress={() => setCurrentScreen("progress")}
          onAuth={() => setCurrentScreen("auth")}
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
