import type { DrinkRecord } from '../types/water'

const DB_NAME = 'water'
const DB_VERSION = 2
const STORE_NAME = 'drinks'

let dbInstance: IDBDatabase | null = null
let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance)
  if (dbPromise) return dbPromise

  if (!import.meta.client || !('indexedDB' in window)) {
    return Promise.reject(new Error('IndexedDB недоступен'))
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }

    request.onsuccess = () => {
      const db = request.result
      db.onversionchange = () => {
        db.close()
        dbInstance = null
        dbPromise = null
      }
      dbInstance = db
      dbPromise = null
      resolve(db)
    }

    request.onerror = () => {
      dbPromise = null
      reject(request.error ?? new Error('Ошибка открытия IndexedDB'))
    }
  })

  return dbPromise
}

export async function getAllDrinks(): Promise<DrinkRecord[]> {
  const db = await openDb()
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result as DrinkRecord[])
    request.onerror = () => reject(request.error ?? new Error('Ошибка чтения'))
  })
}

export async function addDrink(amount: number): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const record: DrinkRecord = { at: new Date().toISOString(), amount }
    const request = store.add(record)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error('Ошибка записи'))
  })
}

export async function updateDrinkTime(id: number, at: string): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const getRequest = store.get(id)

    getRequest.onsuccess = () => {
      const existing = getRequest.result as DrinkRecord | undefined
      if (!existing) {
        reject(new Error('Запись не найдена'))
        return
      }

      const updateRequest = store.put({ ...existing, id, at })
      updateRequest.onsuccess = () => resolve()
      updateRequest.onerror = () =>
        reject(updateRequest.error ?? new Error('Ошибка обновления'))
    }

    getRequest.onerror = () =>
      reject(getRequest.error ?? new Error('Ошибка чтения записи'))
  })
}
