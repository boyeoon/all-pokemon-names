import PokemonQuiz from "@/components/quiz/pokemonquiz";
import { PokeNames } from "@/pokename";

export default function All() {
  return (
    <div>
      <p className="m-8 lg:m-16 text-2xl md:text-4xl font-bold text-center">
        <ruby>
          모든 지방
          <rt className="tracking-[.5em] text-primary">1-9세대</rt>
        </ruby>
        &nbsp;
        <span className="underline rounded text-primary decoration-wavy decoration-3">
          1025마리
        </span>
        <span>의&nbsp;</span>
        <span className="block md:inline-block pt-2">
          포켓몬을 전부 알고있나요?
        </span>
      </p>
      <PokemonQuiz
        numPokemonsStr={1}
        numPokemonsEnd={1025}
        regionPokemons={PokeNames.All}
      />
    </div>
  );
}
