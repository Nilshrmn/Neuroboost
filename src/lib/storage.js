export const storage = {
  save(key, value) {
    if (typeof window !== "undefined") {
      localStorage.setItem(`neuroboost_${key}`, JSON.stringify(value))
    }
  },

  load(key) {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(`neuroboost_${key}`)
      return item ? JSON.parse(item) : null
    }
    return null
  },

  remove(key) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`neuroboost_${key}`)
    }
  },
}
