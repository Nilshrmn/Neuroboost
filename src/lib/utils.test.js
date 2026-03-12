import { describe, test, expect } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
    test("fügt mehrere Klassen zusammen", () => {
        expect(cn("px-2", "py-2")).toBe("px-2 py-2")
    })

    test("ignoriert falsy values", () => {
        expect(cn("base", false, null, undefined, "active")).toBe("base active")
    })
})