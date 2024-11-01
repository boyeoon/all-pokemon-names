export interface PokeAPI {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

export const fetchPokemonData = async (id: number): Promise<PokeAPI> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) {
    throw new Error("포켓몬 데이터를 가져오는 데 문제가 발생했습니다.");
  }
  const data = await response.json();

  const koreanResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}`
  );
  if (!koreanResponse.ok) {
    throw new Error("포켓몬 이름을 가져오는 데 문제가 발생했습니다.");
  }
  const koranData = await koreanResponse.json();

  const koreanName =
    koranData.names?.find(
      ({ language }: { language: { name: string } }) => language.name === "ko"
    )?.name || "이름을 찾을 수 없음";

  return {
    id: data.id,
    name: koreanName,
    sprites: data.sprites,
  };
};
