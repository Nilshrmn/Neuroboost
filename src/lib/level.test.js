import { describe, it, expect } from "vitest"
import { getLevelByPoints, getProgressToNextLevel, LEVELS } from "./level"

describe("getLevelByPoints", () => {
    it("gibt Level 1 bei 0 Punkten zurück", () => {
        const level = getLevelByPoints(0)
        expect(level.level).toBe(1)
    })

    it("steigt bei Erreichen der Level-Schwelle auf", () => {
        expect(getLevelByPoints(0).level).toBe(1)
        expect(getLevelByPoints(100).level).toBe(2)
        expect(getLevelByPoints(250).level).toBe(3)
    })

    it("bleibt im gleichen Level, solange die nächste Schwelle nicht erreicht ist", () => {
        expect(getLevelByPoints(99).level).toBe(1)
        expect(getLevelByPoints(249).level).toBe(2)
    })
})

describe("getProgressToNextLevel", () => {
    it("gibt 100 zurück, wenn es kein nächstes Level mehr gibt", () => {
        const lastLevel = LEVELS[LEVELS.length - 1]
        const progress = getProgressToNextLevel(lastLevel.pointsRequired + 1000)

        expect(progress).toBe(100)
    })

    it("berechnet den Fortschritt zum nächsten Level korrekt", () => {
        const progressAt0 = getProgressToNextLevel(0)
        const progressAt50 = getProgressToNextLevel(50)
        const progressAt100 = getProgressToNextLevel(100)

        expect(Math.round(progressAt0)).toBe(0)
        expect(Math.round(progressAt50)).toBe(50)
        expect(progressAt100).toBeGreaterThanOrEqual(0)
    })
})