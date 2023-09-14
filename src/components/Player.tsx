import { useEffect } from "react";
import { CHAIR_POSITIONS, ChairIndex, Player as PlayerType, audios } from "./Room";
import { Card } from "./Card";
import { Chip } from "./Chip";
import { PlayerTimer } from "./ProgressBar";

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

  useEffect(() => {
    turnPlayer && isUser ? audios.timerClock.play() : audios.timerClock.pause();
  }, [turnPlayer]);

  useEffect(() => {
    if (player.status === 'WON') audios.winner.play();
    if (player.status === 'LOST') audios.looser.play();
  }, [player.status]);

  return (
    <div 
      className={`absolute flex justify-center items-center rounded-full w-24 h-24 border-4 ${style} `}
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
      <div className="absolute -bottom-1/2 left-1/3 flex items-end gap-4">
        {!!player.count && <span className="text-sm font-bold text-white">{player.count}</span>}
        <div className="flex items-center">
          {player.cards.map((card, index) => <Card key={`${card.label}_${card.suit}`} card={card} index={index} />)}
        </div>
      </div>
      {turnPlayer && (
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 text-white text-lg font-bold">
          {turnEndsIn}
        </div>
      )}
      {!!player.bet && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[150%]">
          <Chip value={player.bet} />
        </div>
      )}
      {player.status !== 'IDLE' && (
        <div className="absolute left-1/2 -top-1/2 -translate-x-1/2 -translate-y-1/4 bg-yellow-950 p-2 text-sm font-bold text-yellow-400 rounded-full">
          {player.status}
        </div>
      )}
      {turnPlayer && <PlayerTimer className="absolute -z-10 rounded-full transition-all duration-150" size={108} value={30 - (turnEndsIn ?? 0)} max={30} />}
    </div>
  )
}