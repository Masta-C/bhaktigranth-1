export default function QnAPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Community</p>
        <h1 className="font-serif text-4xl font-bold mb-4">Questions &amp; Answers</h1>
        <p className="text-gray-500 max-w-lg leading-relaxed">
          Ask a question or browse answers to questions others have asked.
        </p>
      </div>

      {/* Submit question form — will wire to Firestore in Stage 3 */}
      <div className="border border-gray-100 p-8 mb-16 bg-gray-50">
        <h2 className="font-serif text-xl font-bold mb-2">Ask a Question</h2>
        <p className="text-sm text-gray-500 mb-6">
          Submit your question and it may be answered and published here.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">
              Your Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Anonymous"
              disabled
              className="w-full border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">
              Your Question
            </label>
            <textarea
              rows={4}
              placeholder="What would you like to ask?"
              disabled
              className="w-full border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-black transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            disabled
            className="bg-black text-white text-sm font-medium px-8 py-3 hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Question
          </button>
          <p className="text-xs text-gray-400">Submission coming soon — check back shortly.</p>
        </div>
      </div>

      {/* Placeholder Q&A list — will be replaced with Firestore/Sanity data in Stage 3 */}
      <div className="space-y-12">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase">Published Answers</p>
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-gray-100 pb-12">
            <h3 className="font-serif text-xl font-bold mb-4">
              Sample question will appear here?
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              The answer to this question will appear here once content is connected via the admin panel.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
