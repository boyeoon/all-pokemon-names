import Link from "next/link";

interface LinkItem {
  href: string;
  label: string;
}

export default function Home() {
  const links: LinkItem[] = [
    { href: "/regions/kanto", label: "관동지방" },
    { href: "/regions/johto", label: "성도지방" },
    { href: "/regions/hoenn", label: "호연지방" },
    { href: "/regions/sinnoh", label: "신오지방" },
    { href: "/regions/unova", label: "하나지방" },
    { href: "/regions/kalos", label: "칼로스지방" },
    { href: "/regions/alola", label: "알로라지방" },
    { href: "/regions/galar", label: "가라르지방" },
    { href: "/regions/paldea", label: "팔데아지방" },
    { href: "/regions/all", label: "모든 지방" },
  ];
  return (
    <div>
      <main className="flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 m-12 sm:grid-cols-3 md:grid-cols-5">
          {links.map((link) => (
            <div key={link.href} className="text-center">
              <Link
                href={link.href}
                className="block p-8 m-2 text-lg border rounded-lg border-slate-500 hover:border-slate-200 shadow-3xl"
              >
                {link.label}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
