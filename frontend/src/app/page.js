import CarCard from "@/components/CarCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-zinc-200 pb-8">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
            Inventario <span className="text-blue-600">Premium</span>
          </h1>
          <p className="text-zinc-500">Transporte y selección excelentemente manejada.</p>
        </header>

        <CarCard />
      </main>
    </div>
  );
}