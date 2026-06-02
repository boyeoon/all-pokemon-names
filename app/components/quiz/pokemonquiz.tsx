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
type ResultType = "completed" | "ended";

interface QuizResult {
  type: ResultType;
  elapsedSeconds: number;
  matchedCount: number;
  missedPokemons: Pokemon[];
}

const formatElapsedTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
};

export default function PokemonQuiz({
  numPokemonsStr,
  numPokemonsEnd,
  regionPokemons,
}: PokemonQuizProps) {
  const [inputValue, setInputValue] = useState("");
  const [matchedPokemonIds, setMatchedPokemonIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const [quizMode, setQuizMode] = useState<QuizMode>("easy");
  const [lightColor, setLightColor] = useState<"blue" | "red" | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [focusedPokemonTarget, setFocusedPokemonTarget] = useState<{
    id: number;
    requestId: number;
  } | null>(null);
  const lightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pokemonElementRefs = useRef<Record<number, HTMLDivElement | null>>({});

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
      new Map(pokemons.map((pokemon) => [pokemon.name.toLowerCase(), pokemon])),
    [pokemons],
  );

  useEffect(() => {
    setMatchedPokemonIds(new Set());
    setInputValue("");
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setQuizResult(null);
    setFocusedPokemonTarget(null);
  }, [pokemons]);

  useEffect(() => {
    if (!isTimerRunning) return;

    const timerId = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isTimerRunning]);

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

  useEffect(() => {
    if (!focusedPokemonTarget || quizResult) return;

    const pokemonElement = pokemonElementRefs.current[focusedPokemonTarget.id];
    if (!pokemonElement) return;

    pokemonElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [focusedPokemonTarget, matchedPokemonIds, quizResult]);

  const buildQuizResult = useCallback(
    (type: ResultType, matchedIds: Set<number>, seconds: number) => {
      const missedPokemons = pokemons.filter(
        (pokemon) => !matchedIds.has(pokemon.id),
      );

      return {
        type,
        elapsedSeconds: seconds,
        matchedCount: matchedIds.size,
        missedPokemons,
      };
    },
    [pokemons],
  );

  const finishQuiz = useCallback(
    (type: ResultType, matchedIds = matchedPokemonIds) => {
      setIsTimerRunning(false);
      setQuizResult(buildQuizResult(type, matchedIds, elapsedSeconds));
    },
    [buildQuizResult, elapsedSeconds, matchedPokemonIds],
  );

  useEffect(() => {
    if (
      pokemons.length > 0 &&
      matchedPokemonIds.size === pokemons.length &&
      isTimerRunning &&
      !quizResult
    ) {
      finishQuiz("completed", matchedPokemonIds);
    }
  }, [
    finishQuiz,
    isTimerRunning,
    matchedPokemonIds,
    pokemons.length,
    quizResult,
  ]);

  const handleGuess = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedInput = inputValue.trim().toLowerCase();

      if (!trimmedInput || quizResult) return;

      const matchedPokemons =
        trimmedInput === "니드런"
          ? pokemons.filter(
              (pokemon) =>
                pokemon.name === "니드런♀" || pokemon.name === "니드런♂",
            )
          : [pokemonByName.get(trimmedInput)].filter(
              (pokemon): pokemon is Pokemon => pokemon !== undefined,
            );

      setLightColor(matchedPokemons.length > 0 ? "blue" : "red");

      if (matchedPokemons.length > 0) {
        setFocusedPokemonTarget((prev) => ({
          id: matchedPokemons[0].id,
          requestId: (prev?.requestId ?? 0) + 1,
        }));

        setMatchedPokemonIds((prev) => {
          const newPokemonIds = matchedPokemons.filter(
            (pokemon) => !prev.has(pokemon.id),
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
    [inputValue, pokemonByName, pokemons, quizResult],
  );

  const unmatchedPokemons = useMemo(
    () => pokemons.filter((pokemon) => !matchedPokemonIds.has(pokemon.id)),
    [matchedPokemonIds, pokemons],
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
  const resultMissedCount = quizResult?.missedPokemons.length ?? 0;

  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (value.trim() && !isTimerRunning && !quizResult) {
      setIsTimerRunning(true);
    }
  };

  const handleResetQuiz = () => {
    if (lightTimeoutRef.current) clearTimeout(lightTimeoutRef.current);
    setMatchedPokemonIds(new Set());
    setInputValue("");
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setQuizResult(null);
    setLightColor(null);
    setFocusedPokemonTarget(null);
  };

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
        <div className="font-bold text-primary md:text-base lg:text-lg">
          {formatElapsedTime(elapsedSeconds)}
        </div>
        <form onSubmit={handleGuess} className="flex w-full gap-4 sm:w-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={Boolean(quizResult)}
            className="w-full h-12 p-2 font-bold text-black border rounded-lg md:w-28 lg:w-48 outline outline-2 caret-primary"
            placeholder="포켓몬 이름"
          />
          <button
            type="submit"
            disabled={Boolean(quizResult)}
            className="w-full p-2 font-bold text-[#FDFDFD] rounded-lg shadow-md bg-primary hover:bg-primary/70 hover:shadow-primary/70 disabled:cursor-not-allowed disabled:bg-primary/40 lg:w-16 h-12 sm:w-auto"
          >
            잡기
          </button>
        </form>
        <button
          type="button"
          onClick={() => finishQuiz("ended")}
          disabled={Boolean(quizResult) || matchedCount === pokemons.length}
          className="w-full h-12 p-2 font-bold text-[#FDFDFD] rounded-lg shadow-md bg-rose-600 hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-600/40 sm:w-auto"
        >
          종료
        </button>
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
                <div
                  key={pokemon.id}
                  ref={(element) => {
                    pokemonElementRefs.current[pokemon.id] = element;
                  }}
                  className={`rounded-lg text-center transition ${
                    focusedPokemonTarget?.id === pokemon.id
                      ? "ring-4 ring-primary/80"
                      : ""
                  }`}
                >
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
      {quizResult && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-lg border border-slate-300/30 bg-slate-900/90 p-6 text-center shadow-4xl">
            <h2 className="text-2xl font-bold text-primary">
              {quizResult.type === "completed" ? "전부 잡았어요!" : "퀴즈 종료"}
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm font-bold sm:text-base">
              <div className="rounded-lg border border-slate-500 p-3">
                <p className="text-slate-300">시간</p>
                <p className="mt-1 text-primary">
                  {formatElapsedTime(quizResult.elapsedSeconds)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-500 p-3">
                <p className="text-slate-300">잡은 포켓몬</p>
                <p className="mt-1 text-primary">
                  {quizResult.matchedCount}마리
                </p>
              </div>
              <div className="rounded-lg border border-slate-500 p-3">
                <p className="text-slate-300">놓친 포켓몬</p>
                <p className="mt-1 text-primary">{resultMissedCount}마리</p>
              </div>
            </div>
            {resultMissedCount > 0 && (
              <div className="mt-5 max-h-64 overflow-y-auto rounded-lg border border-slate-500 bg-slate-950/60 p-4 text-left">
                <p className="mb-3 text-center font-bold text-[#FDFDFD]">
                  놓친 포켓몬
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                  {quizResult.missedPokemons.map((pokemon) => (
                    <span key={pokemon.id}>
                      #{pokemon.id} {pokemon.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleResetQuiz}
              className="mt-6 h-12 rounded-lg bg-primary px-6 font-bold text-[#FDFDFD] shadow-md hover:bg-primary/70"
            >
              다시 하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
