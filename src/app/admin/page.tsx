export default function AdminPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Protected</p>
        <h1 className="font-serif text-4xl font-bold mb-4">Admin</h1>
        <p className="text-gray-500 max-w-lg leading-relaxed">
          This area will be protected with Firebase Auth in Stage 4. For now, it is a placeholder.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { label: "Blog Posts", value: "—", note: "via Sanity Studio" },
          { label: "Vlogs", value: "—", note: "via Sanity Studio" },
          { label: "Pending Questions", value: "—", note: "via Firestore" },
        ].map(({ label, value, note }) => (
          <div key={label} className="border border-gray-100 p-6">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3">{label}</p>
            <p className="font-serif text-4xl font-bold mb-1">{value}</p>
            <p className="text-xs text-gray-400">{note}</p>
          </div>
        ))}
      </div>

      <div className="border border-gray-100 p-8 bg-gray-50">
        <h2 className="font-serif text-xl font-bold mb-4">Admin Panel</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Authentication and full admin functionality will be built in Stage 4.
          This will include Q&amp;A moderation, site stats, and quick links to Sanity Studio.
        </p>
      </div>
    </div>
  );
}
