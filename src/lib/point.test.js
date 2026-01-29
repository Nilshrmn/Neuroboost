// src/lib/points.test.js
import { describe, it, expect, beforeEach, vi } from "vitest"
import { calculatePoints, updateUserProgress, updateStreak } from "./points"
import { storage } from "./storage"

let fakeStore

// Storage mock, damit die Tests unabhängig vom Browser laufen
beforeEach(() => {
    fakeStore = {}

    vi.spyOn(storage, "save").mockImplementation((key, value) => {
        fakeStore[key] = value
    })

    vi.spyOn(storage, "load").mockImplementation((key) => {
        return Object.prototype.hasOwnProperty.call(fakeStore, key) ? fakeStore[key] : null
    })
})

describe("calculatePoints", () => {
    it("gibt 0 Punkte zurück, wenn keine Antworten korrekt sind", () => {
        const result = {
            correct: 0,
            total: 5,
            timeSpent: 30,
            difficulty: "medium",
        }

        const points = calculatePoints(result)
        expect(points).toBe(0)
    })

    it("vergibt mehr Punkte bei höherer Schwierigkeit", () => {
        const baseResult = {
            correct: 3,
            total: 5,
            timeSpent: 25, // 5 Sekunden pro Frage
            difficulty: "easy",
        }

        const hardResult = { ...baseResult, difficulty: "hard" }

        const easyPoints = calculatePoints(baseResult)
        const hardPoints = calculatePoints(hardResult)

        expect(hardPoints).toBeGreaterThan(easyPoints)
    })

    it("vergibt mehr Punkte bei schnellerer Bearbeitung", () => {
        const slow = {
            correct: 4,
            total: 5,
            timeSpent: 60, // 12 Sekunden pro Frage
            difficulty: "medium",
        }

        const fast = {
            ...slow,
            timeSpent: 20, // 4 Sekunden pro Frage
        }

        const slowPoints = calculatePoints(slow)
        const fastPoints = calculatePoints(fast)

        expect(fastPoints).toBeGreaterThan(slowPoints)
    })

    it("vergibt einen Bonus bei 100% Genauigkeit", () => {
        const partial = {
            correct: 3,
            total: 5,
            timeSpent: 25,
            difficulty: "medium",
        }

        const perfect = {
            correct: 5,
            total: 5,
            timeSpent: 25,
            difficulty: "medium",
        }

        const partialPoints = calculatePoints(partial)
        const perfectPoints = calculatePoints(perfect)

        expect(perfectPoints).toBeGreaterThan(partialPoints)
    })
})

describe("updateUserProgress", () => {
    it("addiert neue Punkte ohne Level-Up korrekt auf", () => {
        // Ausgangszustand: 0 Punkte, Level 1
        fakeStore.points = 0
        fakeStore.level = 1

        const result = updateUserProgress(50)

        expect(result.totalPoints).toBe(50)
        expect(result.levelUp).toBe(false)
        expect(result.newLevel).toBe(1)
        expect(fakeStore.points).toBe(50)
        // Level wird nur gespeichert, wenn Level-Up passiert, hier also optional
    })

    it("führt bei Erreichen der Schwelle zu einem Level-Up", () => {
        // z.B. 90 Punkte auf Level 1, 20 Punkte verdient -> 110 Punkte => Level 2
        fakeStore.points = 90
        fakeStore.level = 1

        const result = updateUserProgress(20)

        expect(result.totalPoints).toBe(110)
        expect(result.levelUp).toBe(true)
        expect(result.newLevel).toBe(2)
        expect(fakeStore.points).toBe(110)
        expect(fakeStore.level).toBe(2)
    })
})

describe("updateStreak", () => {
    // Hier nutzen wir Fake-Timer, um das Datum zu kontrollieren
    beforeEach(() => {
        vi.useFakeTimers()
    })

    it("setzt die Streak beim ersten Spieltag auf 1", () => {
        vi.setSystemTime(new Date("2025-01-10T12:00:00Z"))

        const streak = updateStreak()

        expect(streak).toBe(1)
        expect(fakeStore.streak).toBe(1)
        expect(fakeStore.last_played).toBe(new Date("2025-01-10T12:00:00Z").toDateString())
    })

    it("erhöht die Streak, wenn an zwei aufeinanderfolgenden Tagen gespielt wird", () => {
        // Gestern gespielt mit Streak 2
        const yesterday = new Date("2025-01-10T12:00:00Z")
        const today = new Date("2025-01-11T12:00:00Z")

        fakeStore.last_played = yesterday.toDateString()
        fakeStore.streak = 2

        vi.setSystemTime(today)

        const streak = updateStreak()

        expect(streak).toBe(3)
        expect(fakeStore.streak).toBe(3)
        expect(fakeStore.last_played).toBe(today.toDateString())
    })

    it("setzt die Streak nach einer Lücke wieder auf 1", () => {
        // Letztes Spiel vor 3 Tagen
        const threeDaysAgo = new Date("2025-01-07T12:00:00Z")
        const today = new Date("2025-01-10T12:00:00Z")

        fakeStore.last_played = threeDaysAgo.toDateString()
        fakeStore.streak = 5

        vi.setSystemTime(today)

        const streak = updateStreak()

        expect(streak).toBe(1)
        expect(fakeStore.streak).toBe(1)
        expect(fakeStore.last_played).toBe(today.toDateString())
    })
})
