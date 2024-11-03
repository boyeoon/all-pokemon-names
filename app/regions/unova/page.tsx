import PokemonQuiz from "@/components/quiz/quiz";

export default function Unova() {
  return (
    <div>
      <p className="m-16 text-4xl font-bold text-center">
        <ruby>
          하나 지방
          <rt className="tracking-[.5em] text-primary">5세대</rt>
        </ruby>
        &nbsp;
        <span className="underline rounded text-primary decoration-wavy decoration-3">
          156마리
        </span>
        의 포켓몬을 전부 알고있나요?
      </p>
      <PokemonQuiz numPokemonsStr={494} numPokemonsEnd={649} />
    </div>
  );
}
