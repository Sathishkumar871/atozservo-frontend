// This is a mock database for demonstration purposes.
// In a real application, you would replace this with actual Firestore SDK calls.

export const db = {
  rooms: new Map(),
};

export const collection = (db, collectionName) => ({ db, collectionName });

export const doc = (db, collectionName, id) => {
  if (!db || !collectionName || !id) {
    throw new Error('Invalid arguments to doc function.');
  }
  return { db, collectionName, id };
};

export const onSnapshot = (docRef, callback) => {
  if (!docRef || !docRef.id) {
    console.error("Invalid docRef provided to onSnapshot.");
    return () => {}; // Return a no-op function
  }
  
  if (!db.rooms.has(docRef.id)) {
    db.rooms.set(docRef.id, {
      hostId: 'user-host-123',
      currentMembers: [{ id: 'user-host-123', name: 'Host' }, { id: 'user-guest-456', name: 'Guest' }],
      isLiveVideo: false,
    });
  }

  const interval = setInterval(() => {
    callback({
      exists: () => db.rooms.has(docRef.id),
      data: () => db.rooms.get(docRef.id),
    });
  }, 1000);

  return () => clearInterval(interval);
};

export const updateDoc = async (docRef, data) => {
  if (!docRef || !docRef.id) {
    console.error("Invalid docRef provided to updateDoc.");
    return;
  }
  const currentData = db.rooms.get(docRef.id) || {};
  db.rooms.set(docRef.id, { ...currentData, ...data });
};

export const deleteDoc = async (docRef) => {
  if (docRef && docRef.id) {
    db.rooms.delete(docRef.id);
  }
};

export const arrayUnion = (element) => element;
export const arrayRemove = (element) => element;