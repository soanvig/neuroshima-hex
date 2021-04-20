import { Board } from '../domain/Board';
import { createGame, Game, getNewVersion, updateGameVersion } from '../domain/Game';
import { db, firestore } from './firebase';

export const stateRepository = {
  onStateChange(gameId: string, cb: (game: Game | null) => void) {
    return db.collection('games')
      .doc(gameId)
      .onSnapshot((doc) => {
        const data = doc.data();

        if (data) {
          cb({
            ...data,
            board: Board.fromJSON(data.board),
          } as Game);
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
  async ensureGame(gameId: string) {
    const doc = await db.collection('games').doc(gameId).get();

    if (!doc.exists) {
      const game = updateGameVersion(createGame());

      await db.collection('games').doc(gameId).set({
        ...game,
        board: game.board.toJSON(),
      });
    }
  },
  async saveState(gameId: string, game: Game) {
    await db.collection('games').doc(gameId).set(game);
  },
};
