"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import Toggle from "@/components/toggle/toggle";
import Pokeball from "@/components/ball/pokeball";

interface PokemonQuizProps {
  numPokemonsStr: number;
  numPokemonsEnd: number;
  regionPokemons: string[];
}

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}

export default function PokemonQuiz({
  numPokemonsStr,
  numPokemonsEnd,
  regionPokemons,
}: PokemonQuizProps) {
  const [inputValue, setInputValue] = useState("");
  const [matchedPokemonIds, setMatchedPokemonIds] = useState<Set<number>>(
    () => new Set()
  );
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const [showIds, setShowIds] = useState(true);
  const [showLights, setShowLights] = useState(true);
  const [lightColor, setLightColor] = useState<"blue" | "red" | null>(null);
  const lightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pokemons = useMemo<Pokemon[]>(() => {
    const totalPokemons = numPokemonsEnd - numPokemonsStr + 1;

    return regionPokemons.slice(0, totalPokemons).map((name, index) => {
      const id = numPokemonsStr + index;

      return {
        id,
        name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });
  }, [numPokemonsStr, numPokemonsEnd, regionPokemons]);

  const pokemonByName = useMemo(
    () =>
      new Map(
        pokemons.map((pokemon) => [pokemon.name.toLowerCase(), pokemon])
      ),
    [pokemons]
  );

  useEffect(() => {
    setMatchedPokemonIds(new Set());
    setInputValue("");
  }, [pokemons]);

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

  useEffect(() => {
    return () => {
      if (lightTimeoutRef.current) clearTimeout(lightTimeoutRef.current);
    };
  }, []);

  const handleGuess = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedInput = inputValue.trim().toLowerCase();

      if (!trimmedInput) return;

      const matchedPokemon = pokemonByName.get(trimmedInput);
      setLightColor(matchedPokemon ? "blue" : "red");

      if (matchedPokemon) {
        setMatchedPokemonIds((prev) => {
          if (prev.has(matchedPokemon.id)) return prev;

          const next = new Set(prev);
          next.add(matchedPokemon.id);
          return next;
        });
      }

      setInputValue("");

      if (lightTimeoutRef.current) clearTimeout(lightTimeoutRef.current);
      lightTimeoutRef.current = setTimeout(() => setLightColor(null), 500);
    },
    [inputValue, pokemonByName]
  );

  const groupPokemons = useMemo(() => {
    const groups = [];
    for (let i = 0; i < pokemons.length; i += itemsPerRow) {
      groups.push(pokemons.slice(i, i + itemsPerRow));
    }
    return groups;
  }, [pokemons, itemsPerRow]);

  const matchedCount = matchedPokemonIds.size;
  const remainingCount = pokemons.length - matchedCount;

  return (
    <div className="p-4 md:p-8 lg:px-20">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-8">
        <div className="font-bold md:text-base lg:text-lg">
          <p>
            <span>현재 {matchedCount}마리</span>
            <span> / </span>
            <span>앞으로 {remainingCount}마리</span>
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
          {groupPokemons.map((group, groupIndex) => (
            <div key={groupIndex} className="flex justify-around m-2">
              {group.map((pokemon) => (
                <div key={pokemon.id} className="text-center">
                  {matchedPokemonIds.has(pokemon.id) ? (
                    <Image
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      width={64}
                      height={64}
                    />
                  ) : (
                    <Pokeball id={pokemon.id} showId={showIds} />
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
