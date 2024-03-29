import { Game, getNewVersion } from '../domain/Game';
import { db, firestore } from './firebase';

export const stateRepository = {
  onStateChange(gameId: string, cb: (game: Game | null) => void) {
    return db.collection('games')
      .doc(gameId)
      .onSnapshot((doc) => {
        const data = doc.data();
        if (data) {
          cb(Game.fromAttrs(data as any));
        } else {
          cb(null);
        }
      });
  },
  async addPlayer(gameId: string, playerName: string) {
    await db.collection('games').doc(gameId).update({
      players: firestore.FieldValue.arrayUnion(playerName),
      version: getNewVersion(),
    });
  },
  async getOrCreate(gameId: string) {
    const doc = await db.collection('games').doc(gameId).get();

    if (!doc.exists) {
      return Game.create();
    } else {
      return Game.fromAttrs(doc.data() as any);
    }
  },
  async saveState(gameId: string, game: Game) {
    await db.collection('games').doc(gameId).set(game.toAttrs());
  },
};
