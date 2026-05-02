"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  if (!user && pathname !== "/admin/login") return null;
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-gray-100 flex flex-col pt-8 px-6 shrink-0">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-8">Admin</p>

        <nav className="flex flex-col gap-1 flex-1">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/posts", label: "Blog Posts" },
            { href: "/admin/vlogs", label: "Vlogs" },
            { href: "/admin/qna", label: "Q&A" },
          ].map(({ href, label }) => {
            const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm py-2 px-3 rounded transition-colors ${
                  isActive ? "bg-black text-white" : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-black transition-colors py-4 text-left"
        >
          Sign Out
        </button>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">{children}</div>
      </div>
    </div>
  );
}
