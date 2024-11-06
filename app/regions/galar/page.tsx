import PokemonQuiz from "@/components/quiz/quiz";
import { PokeNames } from "@/pokename";

export default function Galar() {
  return (
    <div>
      <p className="m-16 text-4xl font-bold text-center">
        <ruby>
          가라르 지방
          <rt className="tracking-[.5em] text-primary">8세대</rt>
        </ruby>
        &nbsp;
        <span className="underline rounded text-primary decoration-wavy decoration-3">
          96마리
        </span>
        의 포켓몬을 전부 알고있나요?
      </p>
      <PokemonQuiz
        numPokemonsStr={810}
        numPokemonsEnd={905}
        regionPokemons={PokeNames.Galar}
      />
    </div>
  );
}
