"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkItem {
  href: string;
  label: string;
}

export default function Header() {
  const pathname = usePathname();

  const links: LinkItem[] = [
    { href: "/regions/kanto", label: "관동" },
    { href: "/regions/johto", label: "성도" },
    { href: "/regions/hoenn", label: "호연" },
    { href: "/regions/sinnoh", label: "신오" },
    { href: "/regions/unova", label: "하나" },
    { href: "/regions/kalos", label: "칼로스" },
    { href: "/regions/alola", label: "알로라" },
    { href: "/regions/galar", label: "가라르" },
    { href: "/regions/paldea", label: "팔데아" },
    { href: "/regions/all", label: "모든 지방" },
  ];

  return (
    <nav className="flex justify-center p-2 border-b-4 border-double md:p-4 border-slate-400">
      <ul className="flex flex-wrap items-start justify-center m-2 space-x-4 sm:space-x-8">
        {links.map((link) => (
          <li key={link.href} className="m-1">
            <Link
              href={link.href}
              className={`text-base lg:text-lg font-bold ${
                pathname === link.href
                  ? "text-primary underline decoration-4"
                  : "hover:text-primary hover:underline decoration-4"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
