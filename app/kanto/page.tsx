import Image from "next/image";

const region = "관동 지방";
const mainText = "의 포켓몬을 전부 알고 있나요?";

// 관동 지방
export default function Kanto() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-4xl font-bold">
        <p>
          <ruby>
            {region}
            <rt>1세대</rt>
          </ruby>
          <span className="text-[#1355f0;]">&nbsp;151마리</span>
          {mainText}
        </p>
      </div>
    </main>
  );
}
