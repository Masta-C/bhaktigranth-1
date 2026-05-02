"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/blogs", label: "Blogs" },
  { href: "/vlogs", label: "Vlogs" },
  { href: "/qna", label: "Q&A" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tight text-black hover:opacity-70 transition-opacity"
        >
          Bhakti Granth
        </Link>

        <nav className="flex items-center gap-8">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? "text-black border-b-2 border-black pb-0.5"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
