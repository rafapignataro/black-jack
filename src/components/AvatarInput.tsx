type AvatarInputProps = {
  index: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function AvatarInput({ index, isSelected = false, onSelect }: AvatarInputProps) {
  return (
    <label className={`relative justify-self-center rounded-full border-4  ${isSelected ? ' border-yellow-500' : 'border-transparent'}`} onClick={onSelect}>
      <input type="radio" name="avatar" className="hidden" value={`avatar_${index}.png`} />
      <div className="w-20 h-20 bg-yellow-900 rounded-full p-1 hover:ring-2 hover:ring-yellow-500 cursor-pointer">
        <img src={`/avatars/avatar_${index}.png`} alt={`Avatar ${index}`} className="w-full h-full rounded-full select-none" />
      </div>
    </label>
  )
}