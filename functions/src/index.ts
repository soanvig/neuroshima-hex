import * as functions from 'firebase-functions';
import { armies } from './armies';
import createClient from '@roomservice/node';
import { v4 } from 'uuid';
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import body from 'body-parser';

const API_KEY = functions.config().roomservice.key;

const rs = createClient(API_KEY);
const app = express();

app.use(body.json());

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

const playersSlots = [{
  x: -400,
  y: -400,
}, {
  x: 300,
  y: -400,
}, {
  x: 300,
  y: 400,
}, {
  x: -400,
  y: 400,
}];


app.post('/createRoom', async (req, res) => {
  const newRoom = v4();

  const checkpoint = await rs.checkpoint(newRoom);

  const tokens = checkpoint.map('tokens');
  const armiesMap = checkpoint.map('armies');

  armies.forEach((army, index) => {
    const slot = playersSlots[index];

    armiesMap.set(army.id, {
      id: army.id,
      name: army.name,
      position: [slot.x, slot.y],
    });

    let markerIndex = 0;

    army.tokens.forEach((token) => {
      if (token.type === 'token' || token.type === 'terrain') {
        for (let i = 0; i < token.count; i++) {
          const id = v4();
          tokens.set(id, {
            id,
            type: token.type,
            tokenId: token.id,
            armyId: army.id,
            visible: token.id.endsWith('sztab'),
            position: [slot.x + 150, slot.y],
          });
        }
      } else if (token.type === 'marker') {
        const markerX = slot.x + markerIndex * 75;
        const markerY = slot.y - 100;
        for (let i = 0; i < token.count; i++) {
          const id = v4();

          tokens.set(id, {
            id,
            type: 'marker',
            tokenId: token.id,
            visible: true,
            position: [markerX, markerY],
          });
        }

        markerIndex += 1;
      }
    });
  });

  await checkpoint.save(tokens, armiesMap);

  res.json({
    room: newRoom,
  });
});

app.post('/auth', async (req, res) => {
  const body = req.body;
  const userID = req.body.userId;

  const resources = [
    {
      object: 'room',
      reference: body.room,
      permission: 'join',
    },
  ];

  const r = await fetch('https://super.roomservice.dev/provision', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer: ${ API_KEY }`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: userID,
      resources,
    }),
  });

  res.json(await r.json());
});

export const api = functions.https.onRequest(app);
