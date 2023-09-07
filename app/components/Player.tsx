import { CHAIR_POSITIONS, ChairIndex, Player as PlayerType } from "../App";
import { Card } from "./Card";
import { Chip } from "./Chip";

type PlayerProps = {
  player: PlayerType;
  chair: ChairIndex;
  isUser: boolean;
  turnPlayer?: PlayerType;
  turnEndsIn?: number;
}

export function Player({ player, isUser, chair, turnPlayer, turnEndsIn }: PlayerProps) {
  const style = (() => {
    if (isUser) return 'bg-red-600 border-red-900';

    return 'bg-emerald-600 border-emerald-900';
  })();

  const label = (() => {
    if (isUser) return 'YOU';

    return `Player ${chair}`;
  })();

  const position = CHAIR_POSITIONS[chair];

  return (
    <div 
      className={`absolute flex justify-center items-center rounded-full w-24 h-24 border-4 ${style}`}
      style={{
        top: position.top, 
        bottom: position.bottom, 
        left: position.left, 
        right: position.right,
        transform: `translate(${position.x}, ${position.y})`
      }}
    >
      <span className="font-bold text-white text-sm">
        {label}
      </span>
      <div className="absolute -bottom-1/2 left-1/2 flex items-center gap-4">
        {player.cards.map((card) => <Card key={`${card.label}_${card.suit}`} card={card} />)}
      </div>
      {turnPlayer && (
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 text-white text-lg font-bold">
          {turnEndsIn}
        </div>
      )}
      {!!player.bet && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[125%]">
          <Chip value={player.bet} />
        </div>
      )}
      {player.status !== 'IDLE' && (
        <div className="absolute left-1/2 -top-1/2 -translate-x-1/2 -translate-y-1/4 bg-yellow-950 p-1 text-sm font-bold text-yellow-500 rounded-full">
          {player.status}
        </div>
      )}
    </div>
  )
}