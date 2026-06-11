import CiscoToolkit from "./CiscoToolkit";

export default function toolkitPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-8 flex justify-center">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3">🧰 TSSR Toolkit</h1>

          <p className="text-slate-400">
            Générateurs, calculateurs et aide-mémoires pour Cisco, Windows et Linux.
          </p>
        </header>

        <CiscoToolkit />
      </div>
    </main>
  );
}