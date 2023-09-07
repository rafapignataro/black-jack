import { CHAIR_POSITIONS, ChairIndex } from "../App";

type ChairProps = {
  chair: ChairIndex;
  onPick: (chair: ChairIndex) => void;
  disabled?: boolean;
}

export function Chair({ chair, onPick, disabled = false }: ChairProps) {
  const position = CHAIR_POSITIONS[chair];

  if (disabled) return (
    <div 
      className="absolute flex justify-center items-center rounded-full w-24 h-24 bg-yellow-950 border-4 border-yellow-900"
      style={{
        top: position.top, 
        bottom: position.bottom, 
        left: position.left, 
        right: position.right,
        transform: `translate(${position.x}, ${position.y})`
      }}
    >
      <span className="font-bold text-white text-sm">
        Chair {chair}
      </span>
    </div>
  )

  return (
    <button 
      className="absolute group flex justify-center items-center rounded-full w-24 h-24 bg-yellow-950 border-4 border-yellow-900 hover:bg-yellow-800"
      style={{
        top: position.top, 
        bottom: position.bottom, 
        left: position.left, 
        right: position.right,
        transform: `translate(${position.x}, ${position.y})`
      }}
      onClick={() => onPick(chair)}
    >
      <span className="block group-hover:hidden font-bold text-white text-sm">
        Chair {chair}
      </span>
      <span className="hidden group-hover:block font-bold text-white text-sm">
        Seat
      </span>
    </button>
  )
}