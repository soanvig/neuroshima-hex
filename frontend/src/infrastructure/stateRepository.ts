import { Game } from '../domain/Game';
import { db, firestore } from './firebase';

export const stateRepository = {
  onStateChange(gameId: string, cb: (game: Game) => void) {
    return db.collection('games')
      .doc(gameId)
      .onSnapshot((doc) => {
        cb(doc.data() as any); // @TODO whatever
      });
  },
  async addPlayer(gameId: string, playerName: string) {
    await db.collection('games').doc(gameId).update({
      players: firestore.FieldValue.arrayUnion(playerName),
    });
  },
  async ensureGame(gameId: string) {
    const doc = await db.collection('games').doc(gameId).get();

    if (!doc.exists) {
      await db.collection('games').doc(gameId).set({
        players: [],
      });
    }
  },
};
