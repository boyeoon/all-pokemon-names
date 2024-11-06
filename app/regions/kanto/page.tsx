import PokemonQuiz from "@/components/quiz/quiz";
import { PokeNames } from "@/pokename";

export default function Kanto() {
  return (
    <div>
      <p className="m-16 text-4xl font-bold text-center">
        <ruby>
          관동 지방
          <rt className="tracking-[.5em] text-primary">1세대</rt>
        </ruby>
        &nbsp;
        <span className="underline rounded text-primary decoration-wavy decoration-3">
          151마리
        </span>
        의 포켓몬을 전부 알고있나요?
      </p>
      <PokemonQuiz
        numPokemonsStr={1}
        numPokemonsEnd={151}
        regionPokemons={PokeNames.Kanto}
      />
    </div>
  );
}
