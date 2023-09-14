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

  const hidingCard = dealer.cards.find(card => !card.show);

  return (
    <div 
      className={`player absolute flex justify-center items-center rounded-full w-32 h-32 border-4 bg-indigo-600 border-indigo-800`}
      style={{
        top: position.top, 
        left: position.left, 
        transform: `translate(${position.x}, ${position.y})`
      }}
    >
      <span className="font-bold text-white text-sm">
        DEALER
      </span>
      <div className="absolute -bottom-1/4 left-1/3 flex items-end gap-4">
        {(!!dealer.count && hidingCard) && <span className="text-sm font-bold text-white">{dealer.count}</span>}
        <div className="flex items-center">
          {dealer.cards.map((card, index) => <Card key={`${card.label}_${card.suit}`} card={card} index={index} />)}
        </div>
      </div>
    </div>
  )
}