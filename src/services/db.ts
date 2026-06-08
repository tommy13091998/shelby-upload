// Lightweight IndexedDB utility for Shelby Upload local fallback storage
export interface UploadedFile {
  id: string; // Shelby Blob ID or unique local ID
  name: string;
  size: number;
  type: string;
  data: Uint8Array; // Raw file data (not encrypted anymore; stored locally)
  isPrivate: boolean;
  encrypted?: boolean; // Legacy flag: true if data was AES-encrypted (old uploads)
  uploadedAt: string;
  ownerAddress: string;
  shareableUrl?: string; // Cache the public shareable link if generated
  txHash?: string; // On-chain Aptos transaction hash
}

const DB_NAME = 'ShelbyUploadDB';
const STORE_NAME = 'files';
const DB_VERSION = 1;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open database');
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('ownerAddress', 'ownerAddress', { unique: false });
      }
    };
  });
}

export async function saveFileRecord(file: UploadedFile): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(file);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getFilesByOwner(ownerAddress: string): Promise<UploadedFile[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('ownerAddress');
    const request = index.getAll(ownerAddress);

    request.onsuccess = () => {
      // Sort by uploadedAt descending
      const files = request.result as UploadedFile[];
      files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      resolve(files);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteFileRecord(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getFileRecord(id: string): Promise<UploadedFile | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}
