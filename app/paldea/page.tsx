import Image from "next/image";

const region = "팔데아 지방";
const mainText = "의 포켓몬을 전부 알고 있나요?";

// 팔데아 지방
export default function Paldea() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-4xl font-bold">
        <p>
          <ruby>
            {region}
            <rt>9세대</rt>
          </ruby>
          <span className="text-[#1355f0;]">&nbsp;110마리</span>
          {mainText}
        </p>
      </div>
    </main>
  );
}
