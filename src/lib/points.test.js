import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { calculatePoints, updateUserProgress, updateStreak } from "./points"
import { storage } from "./storage"

let fakeStore

beforeEach(() => {
    fakeStore = {}

    vi.spyOn(storage, "save").mockImplementation((key, value) => {
        fakeStore[key] = value
    })

    vi.spyOn(storage, "load").mockImplementation((key) => {
        return Object.prototype.hasOwnProperty.call(fakeStore, key) ? fakeStore[key] : null
    })
})

afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
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
            timeSpent: 25,
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
            timeSpent: 60,
            difficulty: "medium",
        }

        const fast = {
            ...slow,
            timeSpent: 20,
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
        fakeStore.points = 0
        fakeStore.level = 1

        const result = updateUserProgress(50)

        expect(result.totalPoints).toBe(50)
        expect(result.levelUp).toBe(false)
        expect(result.newLevel).toBe(1)
        expect(fakeStore.points).toBe(50)
    })

    it("führt bei Erreichen der Schwelle zu einem Level-Up", () => {
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
    it("setzt die Streak beim ersten Spieltag auf 1", () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date("2025-01-10T12:00:00Z"))

        const streak = updateStreak()

        expect(streak).toBe(1)
        expect(fakeStore.streak).toBe(1)
        expect(fakeStore.last_played).toBe(new Date("2025-01-10T12:00:00Z").toDateString())
    })

    it("erhöht die Streak, wenn an zwei aufeinanderfolgenden Tagen gespielt wird", () => {
        vi.useFakeTimers()

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
        vi.useFakeTimers()

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