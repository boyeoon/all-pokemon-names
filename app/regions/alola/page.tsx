import PokemonQuiz from "@/components/quiz/quiz";
import { PokeNames } from "@/pokename";

export default function Alola() {
  return (
    <div>
      <p className="m-16 text-4xl font-bold text-center">
        <ruby>
          알로라 지방
          <rt className="tracking-[.5em] text-primary">7세대</rt>
        </ruby>
        &nbsp;
        <span className="underline rounded text-primary decoration-wavy decoration-3">
          88마리
        </span>
        의 포켓몬을 전부 알고있나요?
      </p>
      <PokemonQuiz
        numPokemonsStr={722}
        numPokemonsEnd={809}
        regionPokemons={PokeNames.Alola}
      />
    </div>
  );
}
