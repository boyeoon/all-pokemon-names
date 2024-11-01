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
  const [showIds, setShowIds] = useState(true); // 포켓몬 ID 표시 여부

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
        <form onSubmit={handleGuess} className="flex justify-center gap-x-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="포켓몬 이름을 입력하세요"
            className="p-2 text-black border border-gray-300 rounded"
          />
          <button type="submit" className="p-2 text-white bg-blue-500 rounded">
            맞추기
          </button>
        </form>
        <div>
          <p>
            현재 {matchedCount}마리 / 앞으로{" "}
            {numPokemonsEnd - numPokemonsStr + 1 - matchedCount}마리
          </p>
        </div>
        <button
          onClick={() => setShowIds((prev) => !prev)}
          className="p-2 text-white bg-green-500 rounded"
        >
          {showIds ? "ID 숨기기" : "ID 보이기"}
        </button>
      </div>
      <div className="m-8 overflow-y-scroll border-4 rounded-lg border-slate-400 max-h-96">
        {groupPokemons().map((group, groupIndex) => (
          <div key={groupIndex} className="flex m-2 justify-around">
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
                      <p className="absolute top-0 left-1/2 transform -translate-x-1/2 m-0 text-center ">
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
