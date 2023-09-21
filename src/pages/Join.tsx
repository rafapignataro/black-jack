import { useState } from "react";
import { AvatarInput } from "../components/AvatarInput";
import { useServerProps } from "../root";

export function Join() {
  const { roomId } = useServerProps<{ roomId: string; }>();

  const [selectedAvatar, setSelectedAvatar] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  return (
    <div className="absolute top-0 left-0 z-50 h-screen w-screen flex items-center justify-center">
      <form method="POST" action="/join-room" className="w-full max-w-md rounded-md p-4 bg-yellow-950 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-yellow-600">Joining room <span className="font-black text-yellow-500">#{roomId}</span></h1>
        <input type="hidden" name="roomId" value={roomId} />
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-bold text-yellow-700">Name</label>
          <input 
            type="text" 
            name="name" 
            id="name" 
            placeholder="Your name" 
            className="h-10 rounded-sm bg-yellow-900 px-2 placeholder:text-yellow-950 text-white text-xl" 
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="name" className="font-bold text-yellow-700">Avatar</label>
          <div className="grid grid-cols-3 gap-6">
            <AvatarInput index={1} isSelected={selectedAvatar === 1} onSelect={() => setSelectedAvatar(1)} />
            <AvatarInput index={2} isSelected={selectedAvatar === 2} onSelect={() => setSelectedAvatar(2)} />
            <AvatarInput index={3} isSelected={selectedAvatar === 3} onSelect={() => setSelectedAvatar(3)} />
            <AvatarInput index={4} isSelected={selectedAvatar === 4} onSelect={() => setSelectedAvatar(4)} />
            <AvatarInput index={5} isSelected={selectedAvatar === 5} onSelect={() => setSelectedAvatar(5)} />
            <AvatarInput index={6} isSelected={selectedAvatar === 6} onSelect={() => setSelectedAvatar(6)} />
          </div>
        </div>
        <button type="submit" className="bg-yellow-500 p-2 rounded-sm text-yellow-950 hover:bg-yellow-600 font-bold mt-4">
          JOIN
        </button>
      </form>
    </div>
  )
}