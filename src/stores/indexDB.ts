// Generic interface for map entries, allowing flexibility in value types
export interface IMapEntry<T> {
  key: string
  value: T
}

// Constants for database name, version, and store name
const DB_NAME = 'MapDatabase'
const DB_VERSION = 1
const STORE_NAME = 'mapStore'

export class IndexedDBMap<T> {
  private static dbInstance: IDBDatabase | null = null

  /**
   * Open or create IndexedDB database as a singleton.
   * Returns a Promise that resolves to the database instance.
   */
  private static async openDatabase(): Promise<IDBDatabase> {
    if (this.dbInstance) {
      return this.dbInstance
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' })
        }
      }

      request.onsuccess = (event: Event) => {
        this.dbInstance = (event.target as IDBOpenDBRequest).result
        resolve(this.dbInstance)
      }

      request.onerror = (event: Event) => {
        reject(`Database error: ${(event.target as IDBOpenDBRequest).error?.message}`)
      }
    })
  }

  /**
   * Stores a Map in IndexedDB.
   * @param map - The Map to store in IndexedDB.
   */
  public static async save<T>(map: Map<string, T>): Promise<void> {
    try {
      const db = await this.openDatabase()
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      // Save each map entry to the object store
      map.forEach((value, key) => {
        const entry: IMapEntry<T> = { key, value }
        store.put(entry)
      })

      transaction.oncomplete = () => console.log('Map successfully saved to IndexedDB.')
      transaction.onerror = () => console.error('Transaction failed:', transaction.error)
    } catch (error) {
      console.error('Failed to save map:', error)
    }
  }

  /**
   * Loads and reconstructs a Map from IndexedDB.
   * @returns A Promise that resolves to the reconstructed Map from IndexedDB.
   */
  public static async load<T>(): Promise<Map<string, T>> {
    const map = new Map<string, T>()
    try {
      const db = await this.openDatabase()
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)

      return new Promise((resolve, reject) => {
        const request = store.openCursor()

        request.onsuccess = (event: Event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
          if (cursor) {
            map.set(cursor.value.key, cursor.value.value)
            cursor.continue()
          } else {
            resolve(map)
          }
        }

        request.onerror = () => reject('Failed to retrieve data from IndexedDB.')
      })
    } catch (error) {
      console.error('Failed to load map:', error)
      return map // Return an empty map in case of error
    }
  }
}
