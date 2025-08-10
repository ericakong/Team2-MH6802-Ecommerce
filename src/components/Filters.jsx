export default function Filters({ categories, category, setCategory }) {
    return (
        <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Category filters">
            {categories.map((c) => (
                <button
                    key={c}
                    className={`px-3 py-2 rounded-md border text-sm min-h-[44px] ${c === category ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                    onClick={() => setCategory(c)}
                    aria-pressed={c === category}
                >
                    {c}
                </button>
            ))}
        </div>
    )
}