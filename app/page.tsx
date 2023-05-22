import Image from "next/image";

const region = "모든 지방";
const mainText = "의 포켓몬을 전부 알고 있나요?";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-4xl font-bold">
        <p>
          {region}
          <span className="text-[#1355f0;]">&nbsp;1,015마리</span>
          {mainText}
        </p>
      </div>
    </main>
  );
}
