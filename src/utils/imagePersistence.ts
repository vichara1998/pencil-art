const DATABASE_NAME = 'grid-pencil-art'
const DATABASE_VERSION = 1
const IMAGE_STORE = 'source-image'
const IMAGE_KEY = 'current'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DATABASE_NAME,
      DATABASE_VERSION,
    )

    request.onupgradeneeded = () => {
      request.result.createObjectStore(IMAGE_STORE)
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function saveSourceImage(
  file: File,
): Promise<void> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      IMAGE_STORE,
      'readwrite',
    )

    transaction.objectStore(IMAGE_STORE).put(
      file,
      IMAGE_KEY,
    )

    transaction.oncomplete = () => {
      database.close()
      resolve()
    }

    transaction.onerror = () => {
      database.close()
      reject(transaction.error)
    }

    transaction.onabort = () => {
      database.close()
      reject(transaction.error)
    }
  })
}

export async function getSavedSourceImage(): Promise<File | null> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      IMAGE_STORE,
      'readonly',
    )

    const request = transaction
      .objectStore(IMAGE_STORE)
      .get(IMAGE_KEY)

    let savedFile: File | null = null

    request.onsuccess = () => {
      savedFile = request.result ?? null
    }

    transaction.oncomplete = () => {
      database.close()
      resolve(savedFile)
    }

    transaction.onerror = () => {
      database.close()
      reject(transaction.error)
    }

    transaction.onabort = () => {
      database.close()
      reject(transaction.error)
    }
  })
}

export async function clearSavedSourceImage(): Promise<void> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      IMAGE_STORE,
      'readwrite',
    )

    transaction.objectStore(IMAGE_STORE).delete(IMAGE_KEY)

    transaction.oncomplete = () => {
      database.close()
      resolve()
    }

    transaction.onerror = () => {
      database.close()
      reject(transaction.error)
    }

    transaction.onabort = () => {
      database.close()
      reject(transaction.error)
    }
  })
}