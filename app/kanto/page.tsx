"use client";
import Image from "next/image";

const region = "관동 지방";
const mainText = "의 포켓몬을 전부 알고 있나요?";

// pokeAPI 151마리
export async function getPokemonList() {
  const respones = await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=151");
  const data = await respones.json();
  return data.results;
}

// interface PokemonGridProps {
//   pokemonList: any;
// }

// 관동 지방
// export default async function Kanto({ pokemonList }: PokemonGridProps) {
export default async function Kanto() {
  const pokemonList = await getPokemonList();
  console.log(pokemonList);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-4xl font-bold">
        <p>
          <ruby>
            {region}
            <rt>1세대</rt>
          </ruby>
          <span className="text-[#1355f0;]">&nbsp;151마리</span>
          {mainText}
        </p>
      </div>
      <div>
        {/* <input
          type="text"
          value={searchText}
          id="pokemonName"
          placeholder="포켓몬 이름을 적어주세요."
        /> */}
      </div>
    </main>
  );
}
