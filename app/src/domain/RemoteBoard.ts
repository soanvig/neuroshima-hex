import { RoomClient, RoomService } from '@roomservice/browser';
import { v4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';
import { sample } from 'lodash';

const service = new RoomService({
  auth: async (params) => {
    let currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
      currentUser = v4();

      localStorage.setItem('currentUser', currentUser);
    }

    const response = await fetch(`${ process.env.CLOUD_FUNCTION_URL }/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUser,
        room: params.room,
      }),
    });

    if (response.status === 401) {
      throw new Error('Unauthorized!');
    }

    const body = await response.json();
    return {
      user: body.user,
      resources: body.resources,
      token: body.token,
    };
  },
  ctx: {},
});

export class RemoteBoard {
  private room?: RoomClient;
  state = new BehaviorSubject<any>({
    tokens: {},
    cursors: [],
    armies: {},
  });

  async start(roomName: string) {
    const room = await service.room(roomName);
    const tokens = room.map('tokens');
    const armies = room.map('armies');

    this.state.next({
      tokens: tokens.toObject(),
      cursors: [],
      armies: this.mapArmies(Object.values(armies.toObject()), Object.values(tokens.toObject())),
    });

    const cursorPresence = room.presence('cursor');

    room.subscribe(tokens, (tokens) => {
      this.state.next({
        ...this.state.getValue(),
        tokens,
        armies: this.mapArmies(Object.values(armies.toObject()), Object.values(tokens)),
      });
    });

    room.subscribe(armies, (armies) => {
      this.state.next({
        ...this.state.getValue(),
        armies: this.mapArmies(Object.values(armies), Object.values(tokens.toObject())),
      });
    });

    room.subscribe(cursorPresence, (v) => {
      this.state.next({
        ...this.state.getValue(),
        cursors: Object.values(v),
      });
    });

    this.room = room;
  }

  setCursorPosition(x: number, y: number) {
    if (!this.room) {
      return;
    }

    const cursorPresence = this.room.presence('cursor');

    cursorPresence.set(`${ x },${ y }`);
  }

  setToken(id: string, props: any) {
    if (!this.room) {
      return;
    }

    const tokens = this.room.map('tokens');

    const currentToken = tokens.get(id);

    if (props.toggleFlip) {
      tokens.set(id, {
        ...tokens.get(id),
        isFlipped: !Boolean(currentToken.isFlipped),
      });
    } else {
      tokens.set(id, {
        ...tokens.get(id),
        ...props,
      });
    }
  }

  drawTokenForArmy(armyId: string) {
    if (!this.room) {
      return;
    }

    const tokens = this.room.map('tokens');

    const token = sample(Object.values(tokens.toObject()).filter((token: any) => {
      return token.armyId === armyId && !token.visible;
    }));

    if (token) {
      tokens.set(token.id, {
        ...token,
        visible: true,
        zIndex: Date.now(),
      });
    }
  }

  private mapArmies(armies: any[], tokens: any[]) {
    return armies.map(army => ({
      ...army,
      tokensLeft: tokens.filter(t => t.armyId === army.id && !t.visible).length,
    }));
  }
}
