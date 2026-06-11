const STORAGE_PREFIX = "neuroboost_"
const STORAGE_VERSION = 1

function getStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return null
  }

  return window.localStorage
}

function getStorageKey(key) {
  return `${STORAGE_PREFIX}${key}`
}

function getBackupKey(key) {
  return `${getStorageKey(key)}_backup`
}

function createEnvelope(value) {
  return JSON.stringify({
    __neuroboostStorageVersion: STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    value,
  })
}

function parseStoredValue(rawValue) {
  if (!rawValue) return null

  const parsed = JSON.parse(rawValue)

  if (parsed && typeof parsed === "object" && "__neuroboostStorageVersion" in parsed) {
    return parsed.value
  }

  return parsed
}

function restoreBackup(localStorageRef, key) {
  const backup = localStorageRef.getItem(getBackupKey(key))

  if (!backup) return null

  try {
    const value = parseStoredValue(backup)
    localStorageRef.setItem(getStorageKey(key), backup)
    return value
  } catch {
    return null
  }
}

export const storage = {
  save(key, value) {
    const localStorageRef = getStorage()
    if (!localStorageRef) return false

    const storageKey = getStorageKey(key)
    const previousValue = localStorageRef.getItem(storageKey)

    try {
      if (previousValue !== null) {
        localStorageRef.setItem(getBackupKey(key), previousValue)
      }

      localStorageRef.setItem(storageKey, createEnvelope(value))
      localStorageRef.setItem(getStorageKey("last_safe_save"), JSON.stringify(new Date().toISOString()))
      return true
    } catch (error) {
      if (previousValue !== null) {
        try {
          localStorageRef.setItem(storageKey, previousValue)
        } catch {
          // Wenn selbst die Wiederherstellung scheitert, lassen wir den alten Zustand unberührt.
        }
      }

      console.warn(`NeuroBoost konnte "${key}" nicht sicher speichern.`, error)
      return false
    }
  },

  load(key, fallback = null) {
    const localStorageRef = getStorage()
    if (!localStorageRef) return fallback

    try {
      const item = localStorageRef.getItem(getStorageKey(key))
      const value = parseStoredValue(item)
      return value ?? fallback
    } catch (error) {
      console.warn(`NeuroBoost konnte "${key}" nicht lesen. Backup wird geprüft.`, error)
      return restoreBackup(localStorageRef, key) ?? fallback
    }
  },

  remove(key) {
    const localStorageRef = getStorage()
    if (!localStorageRef) return false

    localStorageRef.removeItem(getStorageKey(key))
    localStorageRef.removeItem(getBackupKey(key))
    return true
  },

  has(key) {
    const localStorageRef = getStorage()
    return Boolean(localStorageRef?.getItem(getStorageKey(key)))
  },
}
