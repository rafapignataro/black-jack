type CardProps = {
  card: {
    suit: string;
    label: string;
    value: number;
    show: boolean;
  }
}

export function Card({ card }: CardProps) {
  if (!card.show) return (
    <div className="card-back flex flex-col w-12 h-16 rounded-sm -ml-8 shadow-lg relative border-2">
    </div>
  )

  const textColor = ['♦️', '♥️'].includes(card.suit) ? 'text-red-500' : 'text-zinc-950';

  return (
    <div className={`flex flex-col w-12 h-16 bg-white rounded-sm -ml-8 shadow-lg relative ${textColor}`}>
      <div className="absolute top-1 left-1 flex flex-col items-center justify-center">
        <span className="text-xs font-bold">{card.label}</span>
        <span className="text-xs font-bold">{card.suit}</span>
      </div>
      <div className="absolute bottom-1 right-1 flex flex-col items-center justify-center -scale-y-100">
        <span className="text-xs font-bold">{card.label}</span>
        <span className="text-xs font-bold">{card.suit}</span>
      </div>
    </div>
  )
} 