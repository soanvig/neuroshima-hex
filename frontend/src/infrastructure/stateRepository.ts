import { db, firestore } from './firebase';

export const stateRepository = {
  onStateChange(gameId: any, cb: any) {
    return db.collection('games')
      .doc(gameId)
      .onSnapshot((doc: any) => {
        cb(doc.data());
      });
  },
  async addPlayer(gameId: any, playerName: any) {
    await db.collection('games').doc(gameId).update({
      players: firestore.FieldValue.arrayUnion(playerName),
    });
  },
  async ensureGame(gameId: any) {
    const doc = await db.collection('games').doc(gameId).get();

    if (!doc.exists) {
      await db.collection('games').doc(gameId).set({
        players: [],
      });
    }
  },
};
