import { useEffect, useState } from "react";

import { Player } from "./Player";
import { Dealer } from "./Dealer";
import { Chair } from "./Chair";
import { Chip } from "./Chip";

type User = {
  id: string;
  roomId?: string
  online: boolean;
  isPlaying: boolean;
  balance: number;
}

export type Player = {
  id: string;
  roomId: string;
  user: User;
  status: string;
  cards: Array<{
    suit: string;
    label: string;
    value: number;
    show: boolean;
  }>;
  count: boolean;
  played: boolean;
  bet: 25 | 50 | 100 | 500;
}

type RoomState = {
  id: string;
  status: 'IDLE' | 'STARTING' | 'BETTING' | 'DEALING_CARDS' | 'PLAYING' | 'END';
  dealer: {
    id: string;
    roomId: string;
    status: string;
    cards: Array<{
      suit: string;
      label: string;
      value: number;
      show: boolean;
    }>;
    count: boolean;
  },
  players: Array<Player | null>;
  spectators: Array<User>;
  startsIn: number;
  turnEndsIn?: number;
  turnPlayer?: Player;
}

export type ChairIndex = 1 | 2 | 3 | 4 | 5 | 6;

type ChairPosition = {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  x?: number | string;
  y?: number | string;
}

export const CHAIR_POSITIONS: Record<ChairIndex, ChairPosition> = {
  1: { top: '50%', left: 0, x: '-75%', y: '-50%' },
  2: { bottom: '15%', left: 0, x: '50%', y: '50%' },
  3: { bottom: 0, right: '50%', x: '-100%', y: '50%' },
  4: { bottom: 0, left: '50%', x: '100%', y: '50%' },
  5: { bottom: '15%', right: 0, x: '-50%', y: '50%' },
  6: { top: '50%', right: 0, x: '75%', y: '-50%' },
};

const ROOM_STATUS_LABELS: Record<RoomState['status'], string>  = {
  IDLE: 'WAITING FOR PLAYERS',
  STARTING: 'STARTING IN',
  BETTING: 'RECEIVING BETS',
  DEALING_CARDS: 'DEALING CARDS',
  PLAYING: 'PLAYERS TURN',
  END: 'RESULTS'
}

export const audios = {
  chip: new Audio('/sounds/chip.mp3'),
  dealCard: new Audio('/sounds/deal-card.mp3'),
  timerClock: new Audio('/sounds/timer-clock.mp3'),
  winner: new Audio('/sounds/winner.mp3'),
  looser: new Audio('/sounds/looser.mp3'),
}

audios.timerClock.volume = 0.6;
audios.dealCard.playbackRate = 2;

export function Room() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { userId, roomId } = window.__SERVER_PROPS__ as { production: boolean; userId: string; roomId: string;};

  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  const user = (() => {
    if (!roomState) return null;

    const player = roomState.players.find(p => p && p.id === userId);

    if (player) return player.user;

    const spectactor = roomState.spectators.find(s => s.id === userId);

    if (spectactor) return spectactor;

    return null;
  })();

  useEffect(() => {
    const { location } = window;

    const wssProtocol = location.protocol.includes('https') ? 'wss' : 'ws';

    const ws = new WebSocket(`${wssProtocol}://${location.host}`);

    ws.onopen = () => {
      console.info('CONNECTED TO SOCKET');
    }

    ws.onmessage = (a) => {
      let event, data;

      try {
        const message = JSON.parse(a.data);

        event = message.event;
        data = message.data;

        console.info('----- MESSAGE EVENT ------')
        console.info({ event, data });
        console.info('--------------------------------')

        switch (event) {
          case 'ROOM_STATE': {
            setRoomState(data.state);

            switch(data.ref) {
              case 'DEAL_CARD': {
                // audios.dealCard.play();
                break;
              }
            }
          }
        }

        // app.render();
      } catch (err) {
        console.info('----- MESSAGE EVENT ERROR ------')
        console.info({ event, data });
        console.error(err);
        console.info('--------------------------------')
      }
    }

    setWebsocket(ws);

    return () => {
      ws.close();
    }
  }, []);

  function onPickChair(chair: ChairIndex) {
    if (user?.isPlaying) return;

    websocket?.send(JSON.stringify({
      event: 'USER_PICK_CHAIR',
      data: { playerId: user?.id, chair }
    }));
  }

  function handleBet(bet: 25 | 50 | 100 | 500) {
    websocket?.send(JSON.stringify({
      event: 'PLAYER_BET',
      data: { playerId: user?.id, bet }
    }));
  }

  function handleAction(event: 'PLAYER_HIT' | 'PLAYER_STAY') {
    websocket?.send(JSON.stringify({
      event,
      data: { playerId: user?.id }
    }))
  }

  if (!roomState) {
    return (
      <h2 className="z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-3xl text-center text-yellow-950">
        CONNECTING...
      </h2>
    )
  }

  const disableActions = !websocket || !user?.isPlaying || roomState.turnPlayer?.id !== user?.id; 

  const playerTurn = roomState.turnPlayer?.id === user?.id;

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <div className="flex flex-col w-[1024px] h-[640px]">
        <header className="w-full relative">
          <div className="flex items-center justify-between px-4 py-2 container mx-auto">
            <div className="flex flex-col">
              <span className="text-yellow-600 font-bold text-sm -mb-1">ROOM</span>
              <h1 className="text-3xl font-black text-yellow-500"><span className="select-none">#</span>{roomId}</h1>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-yellow-600 font-bold text-sm -mb-1">BALANCE</span>
              <h1 className="text-3xl font-black text-yellow-500"><span className="select-none">$</span>{Number(user?.balance).toFixed(2)}</h1>
            </div>
          </div>
        </header>
        <div id="table" className="bg-green-900 shadow-2xl h-full w-full border-[24px] rounded-[32px] rounded-bl-[50%] rounded-br-[50%] border-yellow-950 relative">
          <h2 className="z-40 absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-3xl text-center">
            {ROOM_STATUS_LABELS[roomState.status]} {!!roomState.startsIn && roomState.startsIn}
          </h2>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pb-4 gap-5">
            {playerTurn && roomState.status === 'PLAYING' && <div className="flex flex-col items-center justify-center gap-4">
              <h3 className="text-2xl font-bold text-white">It's your turn!</h3>
              <div className="flex items-center gap-5">
                <button 
                  className="bg-emerald-500 border-2 border-emerald-600 hover:bg-emerald-600 flex flex-col items-center rounded-md text-white font-bold text-md w-20 h-14 cursor-pointer text-center"
                  disabled={roomState.status !== 'PLAYING' || disableActions}
                  onClick={() => handleAction('PLAYER_HIT')}
                >
                  <span>+</span>
                  HIT
                </button>
                <button 
                  className="bg-red-500 border-2 border-red-600 hover:bg-red-600 flex flex-col items-center rounded-md text-white font-bold text-md w-20 h-14 cursor-pointer text-center"
                  disabled={roomState.status !== 'PLAYING' || disableActions}
                  onClick={() => handleAction('PLAYER_STAY')}
                >
                  <span>-</span>
                  STAND
                </button>
              </div>
            </div>}
            {playerTurn && roomState.status === 'BETTING' && <div className="flex flex-col items-center justify-center gap-4">
              <h3 className="text-2xl font-bold text-white">Your turn to bet!</h3>
              <div className="flex items-center gap-5">
                <Chip value={25} onBet={handleBet} />
                <Chip value={50} onBet={handleBet} />
                <Chip value={100} onBet={handleBet} />
                <Chip value={500} onBet={handleBet} />
              </div>
            </div>}
          </div>
          <Dealer dealer={roomState.dealer} />
          {roomState.players && roomState.players.map((player, chair) => player ? (
            <Player 
              key={player.id} 
              player={player} 
              isUser={player.id === user?.id} 
              chair={chair + 1 as 1 | 2 | 3 | 4 | 5 | 6}
              turnPlayer={roomState.turnPlayer?.id === player.id ? roomState.turnPlayer : undefined}
              turnEndsIn={roomState.turnPlayer?.id === player.id ? roomState.turnEndsIn : undefined}
            />
          ) : <Chair key={`chair_${chair}`} chair={chair + 1 as ChairIndex} onPick={onPickChair} disabled={user?.isPlaying} /> )}
        </div>
      </div>
      
    </div>
  )
}