import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bottom-0 left-0 w-full mt-2 mb-6 text-center">
      <p>
        &copy; {new Date().getFullYear()}. All Pokemon Names. All rights
        reserved.
      </p>
      <div>
        <Link
          href={"https://github.com/boyeoon/all-pokemon-names"}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary hover:underline decoration-4"
        >
          GitHub
        </Link>
      </div>
      <div className="text-xs">
        <span>This project was inspired by </span>
        <Link
          href={"https://all-pokemon-ierukana.com/"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline decoration-4"
        >
          ポケモン全部言えるかな？ゲーム
        </Link>
        <span> and has been authorized.</span>
      </div>
    </footer>
  );
}
