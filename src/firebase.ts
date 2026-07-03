import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Lazy initialization wrapper to prevent build-time crashes before Firebase setup completes
let dbInstance: any = null;

export async function getFirebaseDB() {
  if (dbInstance) return dbInstance;

  try {
    // Dynamic import to prevent typescript compile/load errors if config doesn't exist
    // @ts-ignore
    const configModule = await import(/* @vite-ignore */ '../firebase-applet-config.json');
    const firebaseConfig = configModule.default;

    if (!firebaseConfig || !firebaseConfig.apiKey) {
      console.warn("Firebase configuration found but invalid.");
      return null;
    }

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    return dbInstance;
  } catch (e) {
    console.info("Firebase configuration file 'firebase-applet-config.json' is not yet created. Storage defaulting to localStorage.");
    return null;
  }
}

/**
 * Saves or updates a resume in Firestore shared_resumes collection
 */
export async function saveResumeToFirebase(resumeId: string, resumeData: any): Promise<boolean> {
  const db = await getFirebaseDB();
  if (!db) {
    throw new Error("Firebase database not initialized. Please verify configuration.");
  }

  const docPath = `shared_resumes/${resumeId}`;
  try {
    const cleanId = resumeId.replace(/[^a-zA-Z0-9_\-]/g, '').trim() || 'default';
    
    // Structure schema safely matching blueprint
    const payload = {
      ...resumeData,
      id: cleanId,
      createdAt: resumeData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Attempt to write
    await setDoc(doc(db, 'shared_resumes', cleanId), payload);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    return false;
  }
}

/**
 * Retrieves a resume by ID from Firestore shared_resumes collection
 */
export async function getResumeFromFirebase(resumeId: string): Promise<any | null> {
  const db = await getFirebaseDB();
  if (!db) return null;

  const docPath = `shared_resumes/${resumeId}`;
  try {
    const cleanId = resumeId.replace(/[^a-zA-Z0-9_\-]/g, '').trim();
    if (!cleanId) return null;

    const docSnap = await getDoc(doc(db, 'shared_resumes', cleanId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
    return null;
  }
}

/**
 * Syncs user resume data silently to Firestore in the background for admin tracking.
 * We generate a document ID based on deviceSessionId so it updates that session's data,
 * keeping it clean and preventing duplicate entries per user session.
 */
export async function syncUserResumeToFirebase(deviceSessionId: string, resumeData: any): Promise<boolean> {
  const db = await getFirebaseDB();
  if (!db) return false;

  const docPath = `user_resumes/${deviceSessionId}`;
  try {
    const cleanId = deviceSessionId.replace(/[^a-zA-Z0-9_\-]/g, '').trim() || 'default';
    
    const payload = {
      ...resumeData,
      id: cleanId,
      createdAt: resumeData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'user_resumes', cleanId), payload);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    return false;
  }
}

/**
 * Fetches all tracked user resumes from Firestore for the admin view.
 */
export async function getUserResumesFromFirebase(): Promise<any[]> {
  const db = await getFirebaseDB();
  if (!db) return [];

  try {
    const colRef = collection(db, 'user_resumes');
    const snapshot = await getDocs(colRef);
    const resumes: any[] = [];
    snapshot.forEach(doc => {
      resumes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return resumes;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'user_resumes');
    return [];
  }
}
