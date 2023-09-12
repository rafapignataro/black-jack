import express, { Request } from 'express';
import http from 'http';
import WebSocket from 'ws';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

import { GameServer } from './models/gameServer';
import { getUserIdFromRequest } from './utils/get-player-id-from-request';
import { User } from './models/users';

export interface Socket extends WebSocket {
  userId?: string;
  roomId?: string;
}

export const gameServer = new GameServer();

const app = express();
const server = http.createServer(app);
export const webSocketServer = new WebSocket.Server({ server });
const sockets = new Map<string, Socket>();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/", express.static(path.join(__dirname, '..', "public")));

const imageRegex = /\/.+\.(svg|png|jpg|png|jpeg)$/;
const videoRegex = /\/.+\.(mp4|ogv)$/;
  
app.get(imageRegex, (req, res) => {
  const filePath = req.path;
  res.redirect(303, `http://localhost:3000/src${filePath}`);
});

app.get(videoRegex, (req, res) => {
  const filePath = req.path;
  res.redirect(303, `http://localhost:3000/src${filePath}`);
});

app.get("/:roomId?", async (request, response) => {
  try {
    const production = process.env.NODE_ENV === 'production';
    const userId = getUserIdFromRequest(request);
    const roomId = request.params.roomId;

    if (!roomId) {
      const room = gameServer.rooms.create();

      return response.redirect('/' + room.id);
    }

    const room = gameServer.rooms.find(roomId);

    if (!room) return response.redirect('/');

    const user = (() => {
      if (!userId || !gameServer.users.find(userId)) {
        const user = gameServer.users.create();
        
        console.info(chalk.green('NEW USER CREATED: '), user.id);

        response.cookie('_id_', user.id, {
          maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year,
          httpOnly: true,
          sameSite: true,
        })
        return user;
      }

      return gameServer.users.find(userId) as User;
    })();

    room.join(user);
    
    const props = {
      production,
      roomId,
      userId: user.id
    }

    if (!production) {
      return response.render("index.ejs", { 
        production,
        props
      });
    }
  
    const manifestPath = path.join(__dirname, '..', 'public', 'build', 'manifest.json')
    const manifestFile = fs.readFileSync(manifestPath);
    const manifest = JSON.parse(manifestFile as unknown as string);
  
    response.render("index.ejs", { 
      app_js: `/build/${manifest['app/index.tsx'].file}`,
      app_css: `/build/${manifest['app/index.css'].file}`,
      production,
      props
    });
  } catch (err) {
    console.log(err)
    return response.status(500).json({ err: err.message })
  }
});

webSocketServer.on('connection', (socket: Socket, request: Request) => {
  const userId = getUserIdFromRequest(request);
  if (!userId) return;
  
  const user = gameServer.users.find(userId);
  if (!user) return;

  if (!user.roomId) return;

  const room = gameServer.rooms.find(user.roomId);
  if (!room) return;

  sockets.set(user.id, socket);

  user.connect();

  console.info(chalk.green('CONNECTED USER: '), userId);

  socket.userId = user.id;
  socket.roomId = user.roomId;

  room.emitState();

  socket.onmessage = (messageEvent) => {
    let event: string | undefined;
    let data: any | undefined;

    try {
      const message = JSON.parse(messageEvent.data.toString());

      event = message.event;
      data = message.data;

      console.info('----- MESSAGE EVENT ------')
      console.info({ event, data });
      console.info('--------------------------------')

      switch (event) {
        case 'USER_PICK_CHAIR': {
          room.playerPickChair(user, data.chair);
          break;
        }
        case 'PLAYER_BET': {
          room.playerBet(data.playerId, data.bet);
          break;
        }
        case 'PLAYER_HIT': {
          room.playerHit(data.playerId);
          break;
        }
        case 'PLAYER_STAY': {
          room.playerStay(data.playerId);
          break;
        }
      }
    } catch (err) {
      console.info(chalk.red('----- MESSAGE EVENT ERROR ------'))
      console.info({ event, data });
      console.error(err);
      console.info('--------------------------------')
    }
  }

  socket.on('close', () => {
    user.disconnect();

    sockets.set(user.id, socket);

    room.emitState();
  });
});

// // PAGES
// app.get('/:roomId', (request, response) => {  
//   const roomId = request.params.roomId;

//   if (!roomId) return response.redirect('/home');

//   const room = gameServer.rooms.find(roomId);

//   if (!room) return;

//   const userId = getUserIdFromRequest(request);

//   console.info(chalk.blue('ENTERING ROOM: '), userId ?? 'NEW USER');

//   if (!userId || !gameServer.users.find(userId)) {
//     const user = gameServer.users.create();

//     console.info(chalk.green('NEW USER CREATED: '), user.id);

//     response.setHeader('Set-Cookie', `_id_=${user.id}`);
//   }

//   response.sendFile(path.join(__dirname, 'views/room.html'));
// });

// app.post('/rooms', (request, response) => {
//   const userId = getUserIdFromRequest(request);

//   if (!userId) return response.redirect('/home');

//   const room = gameServer.rooms.create();

//   console.info(chalk.yellow(`USER '${userId}' CREATED ROOM '${room.id}'`));
  
//   return response.redirect('/' + room.id);
// });

const PORT = process.env.PORT || 2500;

server.listen(PORT, () => console.info('SERVER ON: ', PORT))