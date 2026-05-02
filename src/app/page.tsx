import Link from "next/link";
import { getLatestPublishedPost } from "@/lib/firestore-server";

export default async function HomePage() {
  const featured = await getLatestPublishedPost();

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-16 sm:pt-24 pb-16 sm:pb-20 border-b border-gray-100">
        <p className="text-sm font-medium tracking-widest text-gray-400 uppercase mb-6">
          Welcome
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight max-w-2xl mb-6 sm:mb-8">
          Devotion, wisdom, and living with intention.
        </h1>
        <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed mb-8 sm:mb-10">
          A space for reflection — through writing, conversation, and video.
          Explore essays, watch vlogs, and ask questions that matter.
        </p>
        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          <Link
            href="/blogs"
            className="text-sm font-medium tracking-wide border-b-2 border-black pb-0.5 hover:opacity-60 transition-opacity"
          >
            Read the Blog →
          </Link>
          <Link
            href="/vlogs"
            className="text-sm font-medium tracking-wide text-gray-500 hover:text-black transition-colors"
          >
            Watch Vlogs
          </Link>
          <Link
            href="/qna"
            className="text-sm font-medium tracking-wide text-gray-500 hover:text-black transition-colors"
          >
            Ask a Question
          </Link>
        </div>
      </section>

      {/* Featured latest post */}
      {featured && (
        <section className="py-16 border-b border-gray-100">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-8">
            Latest Essay
          </p>
          <div className={`${featured.coverImageUrl ? "md:grid md:grid-cols-2 md:gap-12" : ""} items-start`}>
            {featured.coverImageUrl && (
              <Link href={`/blogs/${featured.slug}`} className="block mb-8 md:mb-0">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={featured.coverImageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            )}
            <div className={!featured.coverImageUrl ? "max-w-2xl" : ""}>
              {featured.category && (
                <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3">
                  {featured.category}
                </p>
              )}
              <Link href={`/blogs/${featured.slug}`}>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mb-4 hover:opacity-70 transition-opacity">
                  {featured.title}
                </h2>
              </Link>
              {featured.excerpt && (
                <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
              )}
              <Link
                href={`/blogs/${featured.slug}`}
                className="text-sm font-medium border-b-2 border-black pb-0.5 hover:opacity-60 transition-opacity"
              >
                Read Essay →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Section previews */}
      <section className="py-16 sm:py-20 grid sm:grid-cols-3 gap-10 sm:gap-12">
        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Blogs</p>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-3">Essays &amp; Writing</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            Long-form reflections on devotion, practice, and the examined life.
          </p>
          <Link href="/blogs" className="text-sm font-medium border-b border-black pb-0.5 hover:opacity-60 transition-opacity">
            All Posts +
          </Link>
        </div>

        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Vlogs</p>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-3">Video Conversations</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            Visual stories and spoken reflections — watch, listen, and contemplate.
          </p>
          <Link href="/vlogs" className="text-sm font-medium border-b border-black pb-0.5 hover:opacity-60 transition-opacity">
            All Videos +
          </Link>
        </div>

        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Q&amp;A</p>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-3">Questions &amp; Answers</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            Ask anything. Browse questions others have asked and the answers that followed.
          </p>
          <Link href="/qna" className="text-sm font-medium border-b border-black pb-0.5 hover:opacity-60 transition-opacity">
            Browse Q&amp;A +
          </Link>
        </div>
      </section>
    </div>
  );
}
