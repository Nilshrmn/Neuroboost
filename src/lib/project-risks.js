export const PROJECT_RISKS = [
  {
    id: "R-01",
    title: "Fortschrittsdaten gehen verloren",
    probability: "Mittel",
    impact: "Hoch",
    priority: "Hoch",
    mitigation: "Speichern mit Versionierung, Backup und defensivem Laden über die zentrale Storage-Schicht.",
  },
  {
    id: "R-02",
    title: "Übungen verhalten sich inkonsistent",
    probability: "Mittel",
    impact: "Hoch",
    priority: "Hoch",
    mitigation: "Level, Punkte und Fortschritt werden validiert, bevor sie gespeichert werden.",
  },
  {
    id: "R-03",
    title: "Mobile Nutzung ist unkomfortabel",
    probability: "Mittel",
    impact: "Mittel",
    priority: "Mittel",
    mitigation: "Touchfreundliche Buttons, Safe-Area-Abstände und responsive Layouts nutzen.",
  },
  {
    id: "R-04",
    title: "Motivation fällt nach kurzer Zeit ab",
    probability: "Mittel",
    impact: "Mittel",
    priority: "Mittel",
    mitigation: "Belohnungen, Streaks, Feedback und personalisierte nächste Übungen sichtbar machen.",
  },
]
