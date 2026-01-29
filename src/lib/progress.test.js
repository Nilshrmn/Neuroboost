// src/lib/progress.test.js
import { describe, it, expect, beforeEach, vi } from "vitest"
import { progressManager } from "./progress"
import { storage } from "./storage"

let fakeStore

beforeEach(() => {
    fakeStore = {}

    vi.spyOn(storage, "save").mockImplementation((key, value)n => {
        fakeStore[key] = value
    })

    vi.spyOn(storage, "load").mockImplementation((key) => {
        return Object.prototype.hasOwnProperty.call(fakeStore, key) ? fakeStore[key] : null
    })
})

describe("progressManager.getExerciseProgress", () => {
    it("liefert eine Default-Struktur, wenn noch kein Fortschritt existiert", () => {
        const progress = progressManager.getExerciseProgress("memory-cards")

        expect(progress.exerciseId).toBe("memory-cards")
        expect(progress.levelsCompleted).toEqual([])
        expect(progress.bestScores).toEqual({})
        expect(progress.attempts).toBe(0)
    })

    it("liefert gespeicherten Fortschritt, wenn Daten vorhanden sind", () => {
        fakeStore.exercise_progress = {
            "memory-cards": {
                exerciseId: "memory-cards",
                levelsCompleted: [1, 2],
                bestScores: { 1: 80, 2: 90 },
                attempts: 3,
                lastPlayed: 123456,
            },
        }

        const progress = progressManager.getExerciseProgress("memory-cards")

        expect(progress.levelsCompleted).toEqual([1, 2])
        expect(progress.bestScores[2]).toBe(90)
        expect(progress.attempts).toBe(3)
    })
})

describe("progressManager.completeLevel", () => {
    it("fügt ein Level zur Liste hinzu und speichert die beste Punktzahl", () => {
        const updated = progressManager.completeLevel("logic-sudoku", 1, 75)

        expect(updated.exerciseId).toBe("logic-sudoku")
        expect(updated.levelsCompleted).toEqual([1])
        expect(updated.bestScores[1]).toBe(75)
        expect(updated.attempts).toBe(1)

        // In fakeStore muss der Fortschritt unter "exercise_progress" liegen
        expect(fakeStore.exercise_progress["logic-sudoku"].levelsCompleted).toEqual([1])
    })

    it("überschreibt die beste Punktzahl nur, wenn der neue Score höher ist", () => {
        fakeStore.exercise_progress = {
            "logic-sudoku": {
                exerciseId: "logic-sudoku",
                levelsCompleted: [1],
                bestScores: { 1: 80 },
                attempts: 2,
                lastPlayed: 1111,
            },
        }

        // schlechterer Score -> bleibt 80
        const afterWorse = progressManager.completeLevel("logic-sudoku", 1, 60)
        expect(afterWorse.bestScores[1]).toBe(80)

        // besserer Score -> wird aktualisiert
        const afterBetter = progressManager.completeLevel("logic-sudoku", 1, 95)
        expect(afterBetter.bestScores[1]).toBe(95)
    })

    it("sortiert die abgeschlossenen Levels aufsteigend", () => {
        const first = progressManager.completeLevel("pattern-shapes", 3, 70)
        const second = progressManager.completeLevel("pattern-shapes", 1, 80)
        const third = progressManager.completeLevel("pattern-shapes", 2, 90)

        expect(third.levelsCompleted).toEqual([1, 2, 3])
    })
})

describe("progressManager.getCategoryProgress", () => {
    it("zählt abgeschlossene Levels und Übungen pro Kategorie korrekt", () => {
        const exercises = [
            { id: "memory-cards" },
            { id: "memory-sequence" },
        ]

        fakeStore.exercise_progress = {
            "memory-cards": {
                exerciseId: "memory-cards",
                levelsCompleted: [1, 2, 3, 4, 5],
                bestScores: { 1: 80 },
                attempts: 3,
                lastPlayed: 1,
            },
            "memory-sequence": {
                exerciseId: "memory-sequence",
                levelsCompleted: [1, 2],
                bestScores: { 1: 60 },
                attempts: 1,
                lastPlayed: 2,
            },
        }

        const result = progressManager.getCategoryProgress("memory", exercises)

        expect(result.category).toBe("memory")
        expect(result.totalExercises).toBe(2)
        expect(result.totalLevels).toBe(10) // 2 Übungen * 5 Levels
        expect(result.completedLevels).toBe(7) // 5 + 2
        expect(result.completedExercises).toBe(1) // nur "memory-cards" hat 5/5
    })
})
