// src/lib/level.test.js
import { describe, it, expect } from "vitest"
import { getLevelByPoints, getProgressToNextLevel, LEVELS } from "./level"

describe("getLevelByPoints", () => {
    it("gibt Level 1 bei 0 Punkten zurück", () => {
        const level = getLevelByPoints(0)
        expect(level.level).toBe(1)
    })

    it("steigt bei Erreichen der Level-Schwelle auf", () => {
        const level1 = getLevelByPoints(0)
        const level2 = getLevelByPoints(100)
        const level3 = getLevelByPoints(250)

        expect(level1.level).toBe(1)
        expect(level2.level).toBe(2)
        expect(level3.level).toBe(3)
    })

    it("bleibt im gleichen Level, solange die nächste Schwelle nicht erreicht ist", () => {
        const beforeLevel2 = getLevelByPoints(99)
        const beforeLevel3 = getLevelByPoints(249)

        expect(beforeLevel2.level).toBe(1)
        expect(beforeLevel3.level).toBe(2)
    })
})

describe("getProgressToNextLevel", () => {
    it("gibt 100 zurück, wenn es kein nächstes Level mehr gibt", () => {
        const lastLevel = LEVELS[LEVELS.length - 1]
        const progress = getProgressToNextLevel(lastLevel.pointsRequired + 1000)

        expect(progress).toBe(100)
    })

    it("berechnet den Fortschritt zum nächsten Level korrekt", () => {
        // Level 1: 0 Punkte, Level 2: 100 Punkte
        const progressAt0 = getProgressToNextLevel(0)   // 0%
        const progressAt50 = getProgressToNextLevel(50) // 50%
        const progressAt100 = getProgressToNextLevel(100) // 0% vom nächsten Level (Level 3), aber Level 2 voll

        expect(Math.round(progressAt0)).toBe(0)
        expect(Math.round(progressAt50)).toBe(50)
        expect(progressAt100).toBeGreaterThanOrEqual(0)
    })
})
