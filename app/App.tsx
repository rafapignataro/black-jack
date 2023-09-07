import { useEffect, useState } from "react";
import { Player } from "./components/Player";
import { Dealer } from "./components/Dealer";
import { Chair } from "./components/Chair";

export type Player = {
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
  played: boolean;
}

type RoomState = {
  id: string;
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
  players: Array<Player | null>
  startsIn: number;
  status: string;
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

type User = {
  id: string;
  roomId?: string
  online: boolean;
  isPlaying: boolean;
}

export const CHAIR_POSITIONS: Record<ChairIndex, ChairPosition> = {
  1: { top: 0, left: 0, x: '-25%', y: '25%' },
  2: { bottom: 0, left: 0, x: '-25%', y: '-25%' },
  3: { bottom: 0, left: '50%', x: '75%', y: '50%' },
  4: { bottom: 0, right: '50%', x: '-75%', y: '50%' },
  5: { bottom: 0, right: 0, x: '25%', y: '-25%' },
  6: { top: 0, right: 0, x: '25%', y: '25%' },
};

export function App() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { roomId } = window.server_props as { production: boolean; userId: string; roomId: string;};

  const [user, setUser] = useState<User | null>(null);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:2500');

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
          case 'USER_STATE': {
            setUser(data.user)
            break;
          }
          case 'ROOM_STATE': {
            setRoomState(data);
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
    }))
  }

  function handleAction(event: 'PLAYER_HIT' | 'PLAYER_STAY') {
    websocket?.send(JSON.stringify({
      event,
      data: { playerId: user?.id }
    }))
  }

  if (!roomState) {
    return (
      <h2 className="z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-3xl text-center">
        CONNECTING...
      </h2>
    )
  }

  const disableActions = !websocket || !user?.isPlaying || roomState.turnPlayer?.id !== user?.id; 

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <header className="absolute top-0 left-0 w-full bg-yellow-950">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex flex-col">
            <span className="text-yellow-800 font-semibold">ROOM</span>
            <h1 className="text-3xl font-black text-yellow-600"><span className="select-none">#</span>{roomId}</h1>
          </div>
          <span className="z-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-yellow-900 font-bold text-center">
            ♥️ ♣️ BLACKJACK ♦️ ♠️
          </span>
          <div></div>
        </div>
      </header>
      {roomState.startsIn && (
        <h2 className="z-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-3xl text-center">
          STARTING IN <br />{roomState.startsIn}
        </h2>
      )}
      {roomState.status === 'IDLE' && (
        <h2 className="z-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-3xl text-center">
          WAITING FOR PLAYERS <br /> TO JOIN TABLE
        </h2>
      )}
      <div id="table" className="bg-green-900 w-[800px] h-[400px] border-[16px] rounded-full border-yellow-700 relative">
        <Dealer dealer={roomState.dealer} />
        {roomState.players && roomState.players.map((player, chair) => player ? (
          <Player 
            key={player.id} 
            player={player} 
            isUser={false} 
            chair={chair + 1 as 1 | 2 | 3 | 4 | 5 | 6}
            turnPlayer={roomState.turnPlayer?.id === player.id ? roomState.turnPlayer : undefined}
            turnEndsIn={roomState.turnPlayer?.id === player.id ? roomState.turnEndsIn : undefined}
          />
        ) : <Chair key={`chair_${chair}`} chair={chair + 1 as ChairIndex} onPick={onPickChair} disabled={user?.isPlaying} /> )}
      </div>
      <div className="absolute bottom-0 left-0 flex justify-center items-center p-4 gap-4 w-full">

      </div>
      <footer className="absolute bottom-0 left-0 w-full bg-yellow-950">
        <div className="flex items-center justify-center p-4 gap-5">
          <button 
            className="bg-amber-500 border-2 border-amber-600 hover:bg-amber-400 text-white font-bold px-4 py-2 rounded-sm text-xl w-24 disabled:bg-amber-700 disabled:border-amber-800 disabled:text-zinc-300"
            disabled={disableActions}
            onClick={() => handleAction('PLAYER_HIT')}
          >
            HIT
          </button>
          <button 
            className="bg-amber-500 border-2 border-amber-600 hover:bg-amber-400 text-white font-bold px-4 py-2 rounded-sm text-xl w-24 disabled:bg-amber-700 disabled:border-amber-800 disabled:text-zinc-300"
            disabled={disableActions}
            onClick={() => handleAction('PLAYER_STAY')}
          >
            STAY
          </button>
        </div>
      </footer>
    </div>
  )
}
