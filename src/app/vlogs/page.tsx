export default function VlogsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Video</p>
        <h1 className="font-serif text-4xl font-bold mb-4">Vlogs</h1>
        <p className="text-gray-500 max-w-lg leading-relaxed">
          Video reflections and conversations — watch, listen, and contemplate.
        </p>
      </div>

      {/* Placeholder grid — will be replaced with Sanity + YouTube content in Stage 2 */}
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
        {[1, 2, 3, 4].map((i) => (
          <article key={i} className="group">
            <div className="aspect-video bg-gray-100 mb-5 flex items-center justify-center overflow-hidden">
              <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold mb-2 group-hover:opacity-70 transition-opacity">
              Video title will appear here
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              A short description of the vlog will show here once content is connected.
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
