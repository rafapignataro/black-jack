import { Card } from "./Card";

type DealerProps = {
  dealer: {
    id: string;
    status: string;
    cards: Array<{
      suit: string;
      label: string;
      value: number;
      show: boolean;
    }>;
    count: boolean;
  }
}

export function Dealer({ dealer }: DealerProps) {
  const position =  { top: 0, left: '50%', x: '-50%', y: '-50%' };

  return (
    <div 
      className={`player absolute flex justify-center items-center rounded-full w-24 h-24 border-4 bg-indigo-600 border-indigo-800`}
      style={{
        top: position.top, 
        left: position.left, 
        transform: `translate(${position.x}, ${position.y})`
      }}
    >
      <span className="font-bold text-white text-sm">
        DEALER
      </span>
      <div className="absolute -bottom-1/2 left-1/2 flex items-center gap-4">
        {dealer.cards.map((card) => <Card key={`${card.label}_${card.suit}`} card={card} />)}
      </div>
    </div>
  )
}