import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-24">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link
            href="/"
            className="font-serif text-lg font-bold tracking-tight text-black hover:opacity-70 transition-opacity"
          >
            Bhakti Granth
          </Link>

          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/blogs" className="hover:text-black transition-colors">Blogs</Link>
            <Link href="/vlogs" className="hover:text-black transition-colors">Vlogs</Link>
            <Link href="/qna" className="hover:text-black transition-colors">Q&A</Link>
          </nav>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Bhakti Granth
          </p>
        </div>
      </div>
    </footer>
  );
}
