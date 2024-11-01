import PokemonQuiz from "@/components/quiz/page";

export default function Kanto() {
  return (
    <div>
      <p className="m-16 text-4xl font-bold text-center">
        <ruby>
          관동 지방
          <rt className="tracking-[.5em] text-primary">1세대</rt>
        </ruby>
        &nbsp;
        <span className="rounded bg-yellow-500/30 text-primary">151마리</span>의
        포켓몬을 전부 알고있나요?
      </p>
      <PokemonQuiz numPokemonsStr={1} numPokemonsEnd={151} />
    </div>
  );
}
