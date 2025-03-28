"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
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
  const lightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set으로 만들어 빠른 탐색 가능
  const regionPokemonSet = useMemo(
    () => new Set(regionPokemons.map((name) => name.toLowerCase())),
    [regionPokemons]
  );

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

      const current = breakpoints.find((bp) => width < bp.max);
      if (current) setItemsPerRow(current.items);
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, []);

  const handleGuess = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedInput = inputValue.trim().toLowerCase();

      if (!trimmedInput) return;

      const isMatched = regionPokemonSet.has(trimmedInput);
      setLightColor(isMatched ? "blue" : "red");

      if (isMatched) {
        setMatchedCount((prev) => prev + 1);
      }

      const matchedPokemon = pokemons.find(
        (pokemon) => pokemon.name === trimmedInput
      );

      if (matchedPokemon) {
        setSprites((prev) => ({
          ...prev,
          [matchedPokemon.id]: matchedPokemon.sprites.front_default,
        }));
      }

      setInputValue("");

      if (lightTimeoutRef.current) clearTimeout(lightTimeoutRef.current);
      lightTimeoutRef.current = setTimeout(() => setLightColor(null), 500);
    },
    [inputValue, pokemons, regionPokemonSet]
  );

  const groupPokemons = useMemo(() => {
    const groups = [];
    for (let i = 0; i < pokemons.length; i += itemsPerRow) {
      groups.push(pokemons.slice(i, i + itemsPerRow));
    }
    return groups;
  }, [pokemons, itemsPerRow]);

  return (
    <div className="p-4 md:p-8 lg:px-20">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-8">
        <div className="font-bold md:text-base lg:text-lg">
          <p>
            <span>현재 {matchedCount}마리</span>
            <span> / </span>
            <span>
              앞으로 {numPokemonsEnd - numPokemonsStr + 1 - matchedCount}마리
            </span>
          </p>
        </div>
        <form onSubmit={handleGuess} className="flex w-full gap-4 sm:w-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-12 p-2 font-bold text-black border rounded-lg md:w-28 lg:w-48 outline outline-2 caret-primary"
            placeholder="포켓몬 이름"
          />
          <button
            type="submit"
            className="w-full p-2 font-bold text-[#FDFDFD] rounded-lg shadow-md bg-primary hover:bg-primary/70 hover:shadow-primary/70 lg:w-16 h-12 sm:w-auto"
          >
            맞추기
          </button>
        </form>
        <div className="flex gap-x-4">
          <Toggle
            isToggled={showIds}
            onToggle={() => setShowIds((prev) => !prev)}
            onText="도감 번호"
            offText="도감 번호"
          />
          <Toggle
            isToggled={showLights}
            onToggle={() => setShowLights((prev) => !prev)}
            onText="정답 불빛"
            offText="정답 불빛"
          />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <div
          id="canvas"
          className={`flex-1 overflow-y-scroll border-4 rounded-lg shadow-4xl max-h-[33rem] transition duration-500 ease-in-out ${
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
                          src="/pokeball.svg"
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
