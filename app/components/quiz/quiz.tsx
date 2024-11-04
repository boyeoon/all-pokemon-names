"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchPokemonData, PokeAPI } from "@/pokeapi";
import Image from "next/image";
import Toggle from "@/components/toggle/toggle";

interface PokemonQuizProps {
  numPokemonsStr: number;
  numPokemonsEnd: number;
}

export default function PokemonQuiz({
  numPokemonsStr,
  numPokemonsEnd,
}: PokemonQuizProps) {
  const [pokemons, setPokemons] = useState<PokeAPI[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [matchedCount, setMatchedCount] = useState(0);
  const [sprites, setSprites] = useState<{ [key: string]: string }>({});
  const [itemsPerRow, setItemsPerRow] = useState(20); // 기본 가로로 보여줄 수
  const [showIds, setShowIds] = useState(true); // 도감 번호 표시 여부
  const [showLights, setShowLights] = useState(true); // 색깔 불빛 표시 여부
  const [lightColor, setLightColor] = useState<string | null>(null); // 현재 색깔

  useEffect(() => {
    const loadPokemons = async () => {
      const pokemonPromises = Array.from(
        { length: numPokemonsEnd - numPokemonsStr + 1 },
        (_, i) => fetchPokemonData(numPokemonsStr + i)
      );

      const pokemonData = await Promise.all(pokemonPromises);
      setPokemons(pokemonData);
    };
    loadPokemons();
  }, [numPokemonsStr, numPokemonsEnd]);

  useEffect(() => {
    const updateItemsPerRow = () => {
      const width = window.innerWidth;
      const breakpoints = [
        { max: 600, items: 3 },
        { max: 900, items: 9 },
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

  const handleGuess = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const matchedPokemon = pokemons.find(
      (pokemon) => pokemon.name === inputValue.trim()
    );

    if (matchedPokemon) {
      setSprites((prevSprites) => ({
        ...prevSprites,
        [matchedPokemon.id]: matchedPokemon.sprites.front_default,
      }));
      setMatchedCount((prevCount) => prevCount + 1);
      setLightColor("blue");
    } else {
      setLightColor("red");
    }

    setInputValue("");
    setTimeout(() => setLightColor(null), 500);
  };

  const groupPokemons = useMemo(() => {
    const groups = [];
    for (let i = 0; i < pokemons.length; i += itemsPerRow) {
      groups.push(pokemons.slice(i, i + itemsPerRow));
    }
    return groups;
  }, [pokemons, itemsPerRow]);

  return (
    <div>
      <div className="flex justify-center gap-x-8">
        <div className="flex items-center text-lg font-bold">
          <p>
            현재 {matchedCount}마리 / 앞으로{" "}
            {numPokemonsEnd - numPokemonsStr + 1 - matchedCount}마리
          </p>
        </div>
        <form onSubmit={handleGuess} className="flex justify-center gap-x-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="p-2 font-bold text-black border rounded-lg outline outline-2 caret-primary"
            placeholder="포켓몬 이름"
          />
          <button
            type="submit"
            className="p-2 font-bold text-[#FDFDFD] rounded-lg shadow-md bg-primary hover:bg-primary/70 hover:shadow-primary/70"
          >
            맞추기
          </button>
        </form>
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

      <div className="flex m-8">
        <div
          id="canvas"
          className={`flex-1 overflow-y-scroll border-4 rounded-lg shadow-3xl border-slate-400 max-h-[33rem] transition duration-500 ease-in-out ${
            showLights && lightColor === "blue"
              ? "border-primary"
              : "border-slate-400"
          } ${
            showLights && lightColor === "red"
              ? "border-[#E53E3E]"
              : "border-slate-400"
          }`}
        >
          {groupPokemons.map((group, groupIndex) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
