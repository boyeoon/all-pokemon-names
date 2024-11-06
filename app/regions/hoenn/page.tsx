import PokemonQuiz from "@/components/quiz/quiz";
import { PokeNames } from "@/pokename";

export default function Hoenn() {
  return (
    <div>
      <p className="m-16 text-4xl font-bold text-center">
        <ruby>
          호연 지방
          <rt className="tracking-[.5em] text-primary">3세대</rt>
        </ruby>
        &nbsp;
        <span className="underline rounded text-primary decoration-wavy decoration-3">
          135마리
        </span>
        의 포켓몬을 전부 알고있나요?
      </p>
      <PokemonQuiz
        numPokemonsStr={252}
        numPokemonsEnd={386}
        regionPokemons={PokeNames.Hoenn}
      />
    </div>
  );
}
