import Image from "next/image";

const mainText = "마리의 포켓몬을 전부 알고 있나요?";

// 가라르 지방
export default function Galar() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <p> {mainText}</p>
      </div>
    </main>
  );
}
