import { db, firestore } from './firebase.js';

export const stateRepository = {
  onStateChange(gameId, cb) {
    return db.collection('games')
      .doc(gameId)
      .onSnapshot(doc => {
        cb(doc.data());
      });
  },
  async addPlayer(gameId, playerName) {
    await db.collection('games').doc(gameId).update({
      players: firestore.FieldValue.arrayUnion(playerName),
    });
  },
  async ensureGame(gameId) {
    const doc = await db.collection('games').doc(gameId).get();

    if (!doc.exists) {
      await db.collection('games').doc(gameId).set({
        players: [],
      });
    }
  },
};