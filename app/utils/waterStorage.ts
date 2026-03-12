import type { DrinkRecord } from '../types/water'

const DB_NAME = 'water'
const DB_VERSION = 2
const STORE_NAME = 'drinks'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!import.meta.client || !('indexedDB' in window)) {
      reject(new Error('IndexedDB недоступен'))
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      reject(request.error ?? new Error('Ошибка открытия IndexedDB'))
    }
  })
}

export async function getAllDrinks(): Promise<DrinkRecord[]> {
  const db = await openDb()
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result as DrinkRecord[])
    request.onerror = () => reject(request.error ?? new Error('Ошибка чтения'))

    tx.oncomplete = () => db.close()
    tx.onerror = () => db.close()
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

    tx.oncomplete = () => db.close()
    tx.onerror = () => db.close()
  })
}
