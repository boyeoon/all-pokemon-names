"use client";

import { useEffect, useState } from "react";
import { fetchPokemonData, PokeAPI } from "@/pokeapi";

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
      </div>
      <div className="m-8 overflow-y-scroll border-4 rounded-lg border-slate-400 max-h-96">
        {groupPokemons().map((group, groupIndex) => (
          <div
            key={groupIndex}
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "10px 0",
            }}
          >
            {group.map((pokemon) => (
              <div key={pokemon.id} style={{ textAlign: "center" }}>
                {sprites[pokemon.id] ? (
                  <img
                    src={sprites[pokemon.id]}
                    alt={pokemon.name}
                    width={60}
                  />
                ) : (
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: "#ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p style={{ margin: 0 }}>{pokemon.id}</p>
                  </div>
                )}
                <p>{pokemon.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
