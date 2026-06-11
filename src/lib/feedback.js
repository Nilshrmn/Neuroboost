export function getExerciseFeedback({ score = 0, total = 1 }) {
  const safeTotal = Math.max(Number(total) || 1, 1)
  const safeScore = Math.max(Number(score) || 0, 0)
  const percentage = Math.round((safeScore / safeTotal) * 100)

  if (percentage >= 90) {
    return {
      label: "Starke Leistung",
      message: "Du hast sehr präzise gearbeitet. Versuche als Nächstes ein höheres Level oder wiederhole die Übung auf Tempo.",
      nextStep: "Nächstes Level versuchen",
    }
  }

  if (percentage >= 70) {
    return {
      label: "Guter Fortschritt",
      message: "Du liegst klar auf Kurs. Eine kurze Wiederholung festigt die Übung und erhöht deine Trefferquote.",
      nextStep: "Level nochmals festigen",
    }
  }

  if (percentage >= 45) {
    return {
      label: "Solide Basis",
      message: "Einige Antworten waren richtig. Trainiere das gleiche Level nochmals und achte auf ruhiges, genaues Arbeiten.",
      nextStep: "Gleiches Level wiederholen",
    }
  }

  return {
    label: "Weiter üben",
    message: "Das Level war noch anspruchsvoll. Starte mit langsamem Tempo und konzentriere dich zuerst auf Genauigkeit.",
    nextStep: "Leichter starten",
  }
}
