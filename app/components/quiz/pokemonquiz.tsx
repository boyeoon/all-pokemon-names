"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
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

type QuizMode = "easy" | "hard";

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
  const [quizMode, setQuizMode] = useState<QuizMode>("easy");
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

      const matchedPokemons =
        trimmedInput === "니드런"
          ? pokemons.filter(
              (pokemon) => pokemon.name === "니드런♀" || pokemon.name === "니드런♂"
            )
          : [pokemonByName.get(trimmedInput)].filter(
              (pokemon): pokemon is Pokemon => pokemon !== undefined
            );

      setLightColor(matchedPokemons.length > 0 ? "blue" : "red");

      if (matchedPokemons.length > 0) {
        setMatchedPokemonIds((prev) => {
          const newPokemonIds = matchedPokemons.filter(
            (pokemon) => !prev.has(pokemon.id)
          );

          if (newPokemonIds.length === 0) return prev;

          const next = new Set(prev);
          newPokemonIds.forEach((pokemon) => next.add(pokemon.id));
          return next;
        });
      }

      setInputValue("");

      if (lightTimeoutRef.current) clearTimeout(lightTimeoutRef.current);
      lightTimeoutRef.current = setTimeout(() => setLightColor(null), 500);
    },
    [inputValue, pokemonByName, pokemons]
  );

  const unmatchedPokemons = useMemo(
    () => pokemons.filter((pokemon) => !matchedPokemonIds.has(pokemon.id)),
    [matchedPokemonIds, pokemons]
  );

  const groupPokemons = useMemo(() => {
    const groups = [];
    for (let i = 0; i < pokemons.length; i += itemsPerRow) {
      groups.push(pokemons.slice(i, i + itemsPerRow));
    }
    return groups;
  }, [pokemons, itemsPerRow]);

  const matchedCount = matchedPokemonIds.size;
  const remainingCount = unmatchedPokemons.length;
  const isEasyMode = quizMode === "easy";

  return (
    <div className="p-4 md:p-8 lg:px-20">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8">
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
        <div className="flex h-12 rounded-lg border border-slate-500 bg-slate-900/60 p-1">
          <div className="group relative">
            <button
              type="button"
              onClick={(event) => {
                setQuizMode("easy");
                event.currentTarget.blur();
              }}
              className={`h-full px-4 font-bold rounded-md transition ${
                isEasyMode
                  ? "bg-primary text-[#FDFDFD]"
                  : "text-slate-300 hover:text-[#FDFDFD]"
              }`}
            >
              쉬움
            </button>
            <div className="pointer-events-none absolute left-1/2 top-12 z-10 hidden w-64 -translate-x-1/2 rounded-lg border border-slate-300/30 bg-slate-950/80 p-4 text-center text-sm font-bold text-[#FDFDFD] shadow-4xl backdrop-blur group-hover:block">
              <p>도감 번호를 알려줘요.</p>
              <p className="mt-2">정답 불빛을 알려줘요.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setQuizMode("hard")}
            className={`px-4 font-bold rounded-md transition ${
              !isEasyMode
                ? "bg-primary text-[#FDFDFD]"
                : "text-slate-300 hover:text-[#FDFDFD]"
            }`}
          >
            어려움
          </button>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <div
          id="canvas"
          className={`flex-1 overflow-y-scroll border-4 rounded-lg shadow-4xl max-h-[33rem] transition duration-500 ease-in-out ${
            isEasyMode && lightColor === "blue"
              ? "border-blue-500"
              : isEasyMode && lightColor === "red"
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
                    <Pokeball id={pokemon.id} showId={isEasyMode} />
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
