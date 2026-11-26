export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFB]/50 pb-8 font-exo" aria-label="Loading search results" aria-busy="true">
      <header className="border-b border-[#F2F4F6] bg-white">
        <div className="mx-auto flex max-w-[1536px] flex-col gap-4 px-4 py-6">
          <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
          <div className="h-14 w-full max-w-2xl animate-pulse rounded-xl border border-[#E5E7EB] bg-gray-50" />
        </div>
      </header>
      <main className="mx-auto max-w-[1536px] px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="hidden w-64 shrink-0 animate-pulse self-start rounded-2xl border border-[#F2F4F6] bg-white p-6 lg:block">
            <div className="mb-6 h-5 w-24 rounded bg-gray-100" />
            <div className="space-y-4">
              {[0, 1, 2, 3, 4].map((item) => <div key={item} className="h-4 rounded bg-gray-100" />)}
              <div className="my-6 border-t border-[#F2F4F6]" />
              <div className="h-5 w-28 rounded bg-gray-100" />
              <div className="grid grid-cols-2 gap-3"><div className="h-9 rounded bg-gray-100" /><div className="h-9 rounded bg-gray-100" /></div>
              <div className="my-6 border-t border-[#F2F4F6]" />
              {[0, 1, 2, 3].map((item) => <div key={item} className="h-4 rounded bg-gray-100" />)}
            </div>
          </aside>
          <section className="min-w-0 flex-1">
            <div className="mb-5 flex items-center justify-between">
              <div className="space-y-2"><div className="h-7 w-48 animate-pulse rounded bg-gray-100" /><div className="h-4 w-32 animate-pulse rounded bg-gray-100" /></div>
              <div className="h-10 w-52 animate-pulse rounded-lg bg-gray-100" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }, (_, index) => (
                <div key={index} className="animate-pulse overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
                  <div className="relative h-60 bg-gray-50">
                    <div className="absolute left-3 top-3 h-6 w-12 rounded-sm bg-gray-100" />
                    <div className="absolute right-3 top-3 flex flex-col gap-2"><div className="size-8 rounded-full bg-gray-100" /><div className="size-8 rounded-full bg-gray-100" /><div className="size-8 rounded-full bg-gray-100" /></div>
                  </div>
                  <div className="flex h-36 flex-col gap-2 p-4"><div className="h-3 w-20 rounded bg-gray-100" /><div className="h-6 w-4/5 rounded bg-gray-100" /><div className="mt-1 h-4 w-28 rounded bg-gray-100" /><div className="mt-auto h-8 rounded bg-gray-100" /></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
