import PokemonQuiz from "@/components/quiz/page";

export default function Kanto() {
  return (
    <div>
      <p className="m-16 text-4xl font-bold text-center">
        <ruby>
          성동 지방
          <rt className="tracking-[.5em] text-primary">2세대</rt>
        </ruby>
        &nbsp;
        <span className="underline rounded text-primary decoration-wavy decoration-3">
          100마리
        </span>
        의 포켓몬을 전부 알고있나요?
      </p>
      <PokemonQuiz numPokemonsStr={152} numPokemonsEnd={251} />
    </div>
  );
}
