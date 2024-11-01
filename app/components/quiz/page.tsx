"use client";

import { useEffect, useState } from "react";
import { fetchPokemonData, PokeAPI } from "@/pokeapi";
import Image from "next/image";

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
  const [itemsPerRow, setItemsPerRow] = useState(15); // 초기 설정
  const [showIds, setShowIds] = useState(true); // 포켓몬 id 표시 여부

  useEffect(() => {
    const loadPokemons = async () => {
      const pokemonPromises = [];
      for (let id = numPokemonsStr; id <= numPokemonsEnd; id++) {
        pokemonPromises.push(fetchPokemonData(id));
      }
      const pokemonData = await Promise.all(pokemonPromises);
      setPokemons(pokemonData);
    };
    loadPokemons();
  }, [numPokemonsStr, numPokemonsEnd]);

  useEffect(() => {
    const updateItemsPerRow = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setItemsPerRow(3);
      } else if (width < 900) {
        setItemsPerRow(9);
      } else {
        setItemsPerRow(15);
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
    }
    setInputValue("");
  };

  const groupPokemons = () => {
    const groups = [];
    for (let i = 0; i < pokemons.length; i += itemsPerRow) {
      groups.push(pokemons.slice(i, i + itemsPerRow));
    }
    return groups;
  };

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
            className="p-2 font-bold text-white rounded-lg shadow-md bg-primary hover:bg-primary/70 hover:shadow-primary/70"
          >
            맞추기
          </button>
        </form>

        <button
          onClick={() => setShowIds((prev) => !prev)}
          className="p-2 font-bold text-white rounded-lg shadow-md bg-primary hover:bg-primary/70 hover:shadow-primary/70"
        >
          {showIds ? "도감 번호 숨기기" : "도감 번호 보이기"}
        </button>
      </div>
      <div className="m-8 overflow-y-scroll border-4 rounded-lg shadow-3xl border-slate-400 max-h-96">
        {groupPokemons().map((group, groupIndex) => (
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
                    ></Image>
                    {showIds && (
                      <p className="absolute top-0 m-0 text-xs text-center transform -translate-x-1/2 left-1/2">
                        {pokemon.id}
                      </p>
                    )}
                  </div>
                )}
                {/* <p>{pokemon.name}</p> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
