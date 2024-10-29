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
          className="hover:underline"
        >
          GitHub
        </Link>
      </div>
    </footer>
  );
}