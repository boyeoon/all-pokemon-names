import PokemonQuiz from "@/components/quiz/quiz";

export default function Kalos() {
  return (
    <div>
      <p className="m-16 text-4xl font-bold text-center">
        <ruby>
          칼로스 지방
          <rt className="tracking-[.5em] text-primary">6세대</rt>
        </ruby>
        &nbsp;
        <span className="underline rounded text-primary decoration-wavy decoration-3">
          72마리
        </span>
        의 포켓몬을 전부 알고있나요?
      </p>
      <PokemonQuiz numPokemonsStr={650} numPokemonsEnd={721} />
    </div>
  );
}
