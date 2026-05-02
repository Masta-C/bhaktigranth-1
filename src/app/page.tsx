import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-24 pb-20 border-b border-gray-100">
        <p className="text-sm font-medium tracking-widest text-gray-400 uppercase mb-6">
          Welcome
        </p>
        <h1 className="font-serif text-5xl font-bold leading-tight max-w-2xl mb-8">
          Devotion, wisdom, and living with intention.
        </h1>
        <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-10">
          A space for reflection — through writing, conversation, and video.
          Explore essays, watch vlogs, and ask questions that matter.
        </p>
        <div className="flex flex-wrap items-center gap-8">
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

      {/* Section previews */}
      <section className="py-20 grid md:grid-cols-3 gap-12">
        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Blogs</p>
          <h2 className="font-serif text-2xl font-bold mb-3">Essays &amp; Writing</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            Long-form reflections on devotion, practice, and the examined life.
          </p>
          <Link href="/blogs" className="text-sm font-medium border-b border-black pb-0.5 hover:opacity-60 transition-opacity">
            All Posts +
          </Link>
        </div>

        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Vlogs</p>
          <h2 className="font-serif text-2xl font-bold mb-3">Video Conversations</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            Visual stories and spoken reflections — watch, listen, and contemplate.
          </p>
          <Link href="/vlogs" className="text-sm font-medium border-b border-black pb-0.5 hover:opacity-60 transition-opacity">
            All Videos +
          </Link>
        </div>

        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Q&amp;A</p>
          <h2 className="font-serif text-2xl font-bold mb-3">Questions &amp; Answers</h2>
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
