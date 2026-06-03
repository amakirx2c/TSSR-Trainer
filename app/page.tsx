export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">
        TSSR Trainer
      </h1>

      <p className="text-xl text-slate-300">
        Cisco • Linux • Windows Server
      </p>

      <div className="mt-8 flex gap-4">
        <button className="bg-blue-600 px-6 py-3 rounded-lg">
          Cisco
        </button>

        <button className="bg-green-600 px-6 py-3 rounded-lg">
          Linux
        </button>

        <button className="bg-purple-600 px-6 py-3 rounded-lg">
          Windows
        </button>
      </div>
    </main>
  );
}