import Image from "next/image";

const region = "하나 지방";
const mainText = "의 포켓몬을 전부 알고 있나요?";

// 하나 지방
export default function Unova() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-4xl font-bold">
        <p>
          <ruby>
            {region}
            <rt>5세대</rt>
          </ruby>
          <span className="text-[#1355f0;]">&nbsp;156마리</span>
          {mainText}
        </p>
      </div>
    </main>
  );
}
