# All Pokémon Names

![kanto-region](https://i.imgur.com/GaJMmXl.png)

This website is currently hosted at [all-pokemon-names](https://all-pokemon-names.vercel.app/).

Do you know all the Pokémon from the Kanto region (1st generation), Johto region (2nd generation), Hoenn region (3rd generation), and beyond? This interactive quiz application allows you to test your knowledge of Pokémon. Your goal is to guess the names of the Pokémon based on their Pokédex numbers. For users who want to enjoy hard mode, there is a feature to display or hide the Pokédex numbers.

|                           |                                  |                                    |
| ------------------------- | -------------------------------- | ---------------------------------- |
| [**English**](/README.md) | [**Korean**](/docs/README_ko.md) | [**Japanese**](/docs/README_jp.md) |

## Features

- When users guess a Pokémon name, the corresponding Pokémon sprite is displayed dynamically.
- Users can see the number of Pokémon they have guessed correctly and how many are left in real-time.
- The application supports responsive design for various screen sizes.
- There is an option to display or hide the Pokédex number.

## How to Use

1. Enter the Pokémon name.
2. Click the "Guess" button or press the Enter key to try and guess the Pokémon.
3. If you guess correctly, the sprite of that Pokémon will appear.
4. Check the number of Pokémon you have guessed correctly and how many are remaining.

## Tech Stack

- [**React**](https://react.dev/)
- [**TypeScript**](https://www.typescriptlang.org/)
- [**Tailwind CSS**](https://tailwindcss.com/)
- [**PokéAPI**](https://pokeapi.co/)

## Folder Structure

```
/all-pokemon-names
├── /app
│ ├── /components
│ │ ├── footer/
│ │ ├── header/
│ │ └── quiz/
│ ├── /regions
│ │ ├── kanto/
│ │ ├── johto/
│ │ └── ...
│ ├── pokeapi.ts
│ └── page.tsx
├── package.json
├── README.md
└── ...
```

## 라이센스

This project is licensed under the [MIT 라이센스](https://mit-license.org/).

---

This project was inspired by [ポケモン全部言えるかな？ゲーム](https://all-pokemon-ierukana.com/) and has been authorized.
