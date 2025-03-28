# All Pokémon Names

![kanto-region](https://i.imgur.com/GaJMmXl.png)

이 웹사이트는 현재 [**all-pokemon-names**](https://all-pokemon-names.vercel.app/)에서 호스팅되고 있습니다.

관동 지방(1세대), 성도 지방(2세대), 호연 지방(3세대) 등 모든 지방의 포켓몬을 전부 알고 있나요?

포켓몬에 대한 지식을 테스트할 수 있는 퀴즈 애플리케이션입니다. 사용자는 포켓몬의 도감 번호를 기반으로 이름을 맞추는 것이 목표입니다. 좀 더 어려운 모드로 즐기고 싶은 사용자를 위해 도감 번호를 표시하거나 숨길 수 있는 기능도 있습니다.

|                        |                                  |                                  |
| ---------------------- | -------------------------------- | -------------------------------- |
| [**영어**](/README.md) | [**한국어**](/docs/README_ko.md) | [**일본어**](/docs/README_jp.md) |

## 기능

- 사용자가 포켓몬 이름을 맞추면 해당 포켓몬의 스프라이트가 나타납니다.
- 현재 맞춘 포켓몬 수와 남은 포켓몬 수를 실시간으로 확인할 수 있습니다.
- 다양한 화면 크기에 맞춘 반응형 디자인을 지원합니다.
- 도감 번호를 표시하거나 숨기는 기능이 있습니다.

## 사용법

1. 포켓몬 이름을 입력하세요.
2. "맞추기" 버튼을 클릭하거나 Enter 키를 눌러 포켓몬을 맞춰보세요.
3. 맞춘 경우, 해당 포켓몬의 스프라이트가 나타납니다.
4. 현재 맞춘 포켓몬 수와 남은 포켓몬 수를 확인하세요.

## 기술 스택

- [**React**](https://react.dev/)
- [**TypeScript**](https://www.typescriptlang.org/)
- [**Tailwind CSS**](https://tailwindcss.com/)
- [**PokéAPI**](https://pokeapi.co/)

## 폴더 구조

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

이 프로젝트는 [MIT 라이센스](https://mit-license.org/)에 따라 라이센스가 부여됩니다.

---

이 프로젝트는 [ポケモン全部言えるかな？ゲーム](https://all-pokemon-ierukana.com/)에서 영감을 받았으며, 허락을 받았습니다.
