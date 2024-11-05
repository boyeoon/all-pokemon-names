import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-16 h-16 animate-spin">
        <Image
          src={"/pokeball.svg"}
          alt="loading..."
          width={256}
          height={256}
        />
      </div>
    </div>
  );
}
