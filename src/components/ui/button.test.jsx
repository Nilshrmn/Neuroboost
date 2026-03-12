import { describe, test, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Button } from "./button"

describe("Button", () => {
    test("rendert den Button-Inhalt", () => {
        render(<Button>Klick mich</Button>)
        expect(screen.getByRole("button", { name: /klick mich/i })).toBeInTheDocument()
    })

    test("rendert standardmässig ein button-Element", () => {
        render(<Button>Test</Button>)
        expect(screen.getByRole("button")).toBeInTheDocument()
    })

    test("ist disabled wenn disabled gesetzt ist", () => {
        render(<Button disabled>Speichern</Button>)
        expect(screen.getByRole("button", { name: /speichern/i })).toBeDisabled()
    })

    test("hat Default-Klassen", () => {
        render(<Button>Default</Button>)
        expect(screen.getByRole("button")).toHaveClass("inline-flex")
        expect(screen.getByRole("button")).toHaveClass("h-9")
    })

    test("hat secondary variant", () => {
        render(<Button variant="secondary">Secondary</Button>)
        expect(screen.getByRole("button")).toHaveClass("bg-secondary")
    })

    test("hat destructive variant", () => {
        render(<Button variant="destructive">Delete</Button>)
        expect(screen.getByRole("button")).toHaveClass("bg-destructive")
    })

    test("hat small size", () => {
        render(<Button size="sm">Small</Button>)
        expect(screen.getByRole("button")).toHaveClass("h-8")
    })

    test("hat icon size", () => {
        render(<Button size="icon">Icon</Button>)
        expect(screen.getByRole("button")).toHaveClass("w-9")
    })
})