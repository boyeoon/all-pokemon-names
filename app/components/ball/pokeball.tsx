import Image from "next/image";
import { memo } from "react";

interface PokeballProps {
  id: number;
  showId: boolean;
}

function Pokeball({ id, showId }: PokeballProps) {
  return (
    <div className="relative flex justify-center">
      <Image src="/pokeball.svg" alt="pokeball" width={64} height={64} />
      {showId && (
        <p className="absolute top-0 m-0 text-xs text-center transform -translate-x-1/2 left-1/2 text-[#FDFDFD] font-bold">
          {id}
        </p>
      )}
    </div>
  );
}

export default memo(Pokeball);
