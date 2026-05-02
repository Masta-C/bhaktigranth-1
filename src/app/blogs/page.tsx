export default function BlogsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Writing</p>
        <h1 className="font-serif text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-500 max-w-lg leading-relaxed">
          Essays and reflections on devotion, wisdom, and intentional living.
        </p>
      </div>

      {/* Placeholder grid — will be replaced with Sanity content in Stage 2 */}
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
        {[1, 2, 3, 4].map((i) => (
          <article key={i} className="group">
            <div className="aspect-video bg-gray-100 mb-5 overflow-hidden" />
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">Category</p>
            <h2 className="font-serif text-2xl font-bold mb-3 group-hover:opacity-70 transition-opacity">
              Post title will appear here
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              A short description of the blog post will show here once content is connected.
            </p>
            <span className="text-xs font-medium tracking-wide text-gray-400">
              Coming soon
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
