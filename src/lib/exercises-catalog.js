export const exercisesCatalog = {
  memory: [
    { level: 1, name: "Basis-Merken", description: "Kurze Sequenzen und klare Fragen", category: "memory", icon: "🧠" },
    { level: 2, name: "Sequenzen & Details", description: "Längere Reihen, mehr Varianten", category: "memory", icon: "🔢" },
    { level: 3, name: "Stress-Memory", description: "Lange Sequenzen, weniger Zeit, Ablenkung", category: "memory", icon: "⏱️" },
  ],
  logic: [
    { level: 1, name: "Logik-Basics", description: "Einfache Muster und Schlussfolgerungen", category: "logic", icon: "🧩" },
    { level: 2, name: "Knifflige Kombi", description: "Mehrstufige Aufgaben, weniger offensichtliche Regeln", category: "logic", icon: "♟️" },
    { level: 3, name: "Denker-Modus", description: "Schwierige Logik, höhere Fehlerkosten", category: "logic", icon: "🧠" },
  ],
  concentration: [
    { level: 1, name: "Fokus", description: "Zählen und schnelle Beobachtung", category: "concentration", icon: "🎯" },
    { level: 2, name: "Ablenkung", description: "Mehr Text, mehr Details, engeres Zeitfenster", category: "concentration", icon: "👁️" },
    { level: 3, name: "Tunnelblick", description: "Komplexe Zähl- und Suchaufgaben unter Druck", category: "concentration", icon: "⚡" },
  ],
  reaction: [
    { level: 1, name: "Reaktion", description: "Reagiere schnell auf das Signal", category: "reaction", icon: "⚡" },
    { level: 2, name: "Schneller & länger", description: "Mehr Runden, kürzere Wartezeit", category: "reaction", icon: "🏁" },
    { level: 3, name: "Go/No-Go", description: "Nur bei Grün klicken – Rot ist eine Falle", category: "reaction", icon: "🛑" },
  ],
  pattern: [
    { level: 1, name: "Muster-Basics", description: "Einfache Wiederholungen und Reihen", category: "pattern", icon: "🔷" },
    { level: 2, name: "Regeln kombinieren", description: "Zahlen-, Symbol- und Schritt-Muster gemischt", category: "pattern", icon: "🔁" },
    { level: 3, name: "Expertenmuster", description: "Fibonacci, Rotation, verschachtelte Regeln", category: "pattern", icon: "🧠" },
  ],
  math: [
    { level: 1, name: "Grundrechnen", description: "+ / - mit kleinen Zahlen", category: "math", icon: "➕" },
    { level: 2, name: "Kombi-Rechnen", description: "× / ÷ und größere Zahlen", category: "math", icon: "🧮" },
    { level: 3, name: "Speed & Mehrschritt", description: "Mehrschritt-Aufgaben gegen die Zeit", category: "math", icon: "⚡" },
  ],
}

export const getCategoryName = (category) => {
  const names = {
    memory: "Gedächtnis",
    logic: "Logik",
    concentration: "Konzentration",
    reaction: "Reaktion",
    pattern: "Mustererkennung",
    math: "Mathematik",
  }
  return names[category]
}

export const getCategoryColor = (category) => {
  const colors = {
    memory: "from-blue-500 to-cyan-500",
    logic: "from-purple-500 to-pink-500",
    concentration: "from-green-500 to-emerald-500",
    reaction: "from-orange-500 to-red-500",
    pattern: "from-indigo-500 to-violet-500",
    math: "from-yellow-500 to-amber-500",
  }
  return colors[category]
}
