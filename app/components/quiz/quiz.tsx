"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchPokemonData, PokeAPI } from "@/pokeapi";
import Image from "next/image";
import Toggle from "@/components/toggle/toggle";
import Loading from "@/components/loading/loading";

interface PokemonQuizProps {
  numPokemonsStr: number;
  numPokemonsEnd: number;
  regionPokemons: string[];
}

export default function PokemonQuiz({
  numPokemonsStr,
  numPokemonsEnd,
  regionPokemons, // 지역 포켓몬 목록
}: PokemonQuizProps) {
  const [pokemons, setPokemons] = useState<PokeAPI[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [matchedCount, setMatchedCount] = useState(0);
  const [sprites, setSprites] = useState<{ [key: string]: string }>({});
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const [showIds, setShowIds] = useState(true);
  const [showLights, setShowLights] = useState(true);
  const [lightColor, setLightColor] = useState<string | null>(null); // 정답 불빛 색상 관리
  const [isLoading, setIsLoading] = useState(true);
  const [borderColor, setBorderColor] = useState<string>("slate");

  useEffect(() => {
    const loadPokemons = async () => {
      const pokemonPromises = Array.from(
        { length: numPokemonsEnd - numPokemonsStr + 1 },
        (_, i) => fetchPokemonData(numPokemonsStr + i)
      );

      const pokemonData = await Promise.all(pokemonPromises);
      setPokemons(pokemonData);
      setIsLoading(false);
    };
    loadPokemons();
  }, [numPokemonsStr, numPokemonsEnd]);

  useEffect(() => {
    const updateItemsPerRow = () => {
      const width = window.innerWidth;
      const breakpoints = [
        { max: 600, items: 5 },
        { max: 900, items: 10 },
        { max: 1500, items: 15 },
        { max: Infinity, items: 20 },
      ];

      const currentBreakpoint = breakpoints.find((bp) => width < bp.max);
      if (currentBreakpoint) {
        setItemsPerRow(currentBreakpoint.items);
      }
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, []);

  const handleGuess = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedInput = inputValue.trim().toLowerCase();

      // 지역 포켓몬 목록에서 맞는 포켓몬이 있는지 확인
      const isMatched = regionPokemons
        .map((name) => name.toLowerCase())
        .includes(trimmedInput);

      if (isMatched) {
        setBorderColor("blue"); // 맞으면 파란색
        setLightColor("blue"); // 맞으면 파란색
        setMatchedCount((prevCount) => prevCount + 1);
      } else {
        setBorderColor("red"); // 틀리면 빨간색
        setLightColor("red"); // 틀리면 빨간색
      }

      // 포켓몬 데이터에서 이름이 일치하는 포켓몬을 찾기
      const matchedPokemon = pokemons.find(
        (pokemon) => pokemon.name === trimmedInput
      );

      if (matchedPokemon) {
        setSprites((prevSprites) => ({
          ...prevSprites,
          [matchedPokemon.id]: matchedPokemon.sprites.front_default,
        }));
      }

      setInputValue("");
      setTimeout(() => {
        setLightColor(null); // 0.5초 후에 불빛을 끄고 원래 색으로 복원
        setBorderColor("slate"); // 원래 테두리 색상으로 복원
      }, 500); // 0.5초 후에 원래 상태로 복원
    },
    [inputValue, pokemons, regionPokemons]
  );

  const groupPokemons = useMemo(() => {
    const groups = [];
    for (let i = 0; i < pokemons.length; i += itemsPerRow) {
      groups.push(pokemons.slice(i, i + itemsPerRow));
    }
    return groups;
  }, [pokemons, itemsPerRow]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-8">
        <div className="text-lg font-bold">
          <p>
            현재 {matchedCount}마리 / 앞으로{" "}
            {numPokemonsEnd - numPokemonsStr + 1 - matchedCount}마리
          </p>
        </div>
        <form onSubmit={handleGuess} className="flex w-full gap-4 sm:w-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 font-bold text-black border rounded-lg sm:w-48 outline outline-2 caret-primary"
            placeholder="포켓몬 이름"
          />
          <button
            type="submit"
            className="p-2 font-bold text-[#FDFDFD] rounded-lg shadow-md bg-primary hover:bg-primary/70 hover:shadow-primary/70 w-full sm:w-auto"
          >
            맞추기
          </button>
        </form>
        <div className="flex gap-x-4">
          <Toggle
            isToggled={showIds}
            onToggle={() => setShowIds((prev) => !prev)}
            onText="도감 번호 켜기"
            offText="도감 번호 끄기"
          />
          <Toggle
            isToggled={showLights}
            onToggle={() => setShowLights((prev) => !prev)}
            onText="정답 불빛 켜기"
            offText="정답 불빛 끄기"
          />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <div
          id="canvas"
          className={`flex-1 overflow-y-scroll border-4 rounded-lg shadow-3xl max-h-[33rem] transition duration-500 ease-in-out ${
            showLights && lightColor === "blue"
              ? "border-blue-500"
              : showLights && lightColor === "red"
              ? "border-red-500"
              : "border-slate-400"
          }`}
        >
          {isLoading ? (
            <Loading />
          ) : (
            groupPokemons.map((group, groupIndex) => (
              <div key={groupIndex} className="flex justify-around m-2">
                {group.map((pokemon) => (
                  <div key={pokemon.id} className="text-center">
                    {sprites[pokemon.id] ? (
                      <Image
                        src={sprites[pokemon.id]}
                        alt={pokemon.name}
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="relative flex justify-center">
                        <Image
                          src={"/pokeball.svg"}
                          alt="pokeball"
                          width={64}
                          height={64}
                        />
                        {showIds && (
                          <p className="absolute top-0 m-0 text-xs text-center transform -translate-x-1/2 left-1/2 text-[#FDFDFD] font-bold">
                            {pokemon.id}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
