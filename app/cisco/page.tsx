"use client";

import { useState } from "react";

const exercises = [
  {
    title: "ACL Standard - Niveau 1",
    difficulty: "Facile",
    question: "Bloque le réseau RH 192.168.20.0/24.",
    expected: [
      "access-list 10 deny 192.168.20.0 0.0.0.255",
      "access-list 10 permit any",
    ],
    explanation:
      "192.168.20.0/24 utilise le masque 255.255.255.0, donc la wildcard est 0.0.0.255. On ajoute permit any pour éviter le deny implicite total.",
  },
  {
    title: "ACL Standard - Niveau 2",
    difficulty: "Facile",
    question: "Bloque le réseau Invités 192.168.30.0/24.",
    expected: [
      "access-list 10 deny 192.168.30.0 0.0.0.255",
      "access-list 10 permit any",
    ],
    explanation:
      "/24 correspond à une wildcard 0.0.0.255. La ligne deny bloque le réseau Invités, puis permit any autorise le reste.",
  },
  {
    title: "ACL Standard - Niveau 3",
    difficulty: "Facile",
    question: "Autorise uniquement le réseau Admin 192.168.10.0/24.",
    expected: ["access-list 10 permit 192.168.10.0 0.0.0.255"],
    explanation:
      "Quand on autorise uniquement un réseau, le deny implicite bloque automatiquement tout le reste. Pas besoin d’ajouter deny any.",
  },
  {
    title: "ACL Standard - Niveau 4",
    difficulty: "Moyen",
    question: "Bloque le réseau Caméras 192.168.40.0/25.",
    expected: [
      "access-list 10 deny 192.168.40.0 0.0.0.127",
      "access-list 10 permit any",
    ],
    explanation:
      "/25 correspond au masque 255.255.255.128. La wildcard inverse est donc 0.0.0.127.",
  },
  {
    title: "ACL Standard - Niveau 5",
    difficulty: "Moyen",
    question: "Bloque le réseau Support 192.168.50.64/27.",
    expected: [
      "access-list 10 deny 192.168.50.64 0.0.0.31",
      "access-list 10 permit any",
    ],
    explanation:
      "/27 correspond au masque 255.255.255.224. La wildcard est 0.0.0.31. Le réseau commence bien à 192.168.50.64.",
  },
  {
    title: "ACL Standard - Niveau 6",
    difficulty: "Moyen",
    question: "Autorise uniquement le réseau IT 172.16.10.0/24.",
    expected: ["access-list 10 permit 172.16.10.0 0.0.0.255"],
    explanation:
      "Cette ACL autorise le réseau IT. Grâce au deny implicite final, tous les autres réseaux sont bloqués.",
  },
  {
    title: "ACL Standard - Niveau 7",
    difficulty: "Avancé",
    question: "Bloque le réseau Invités 10.10.20.0/28.",
    expected: [
      "access-list 10 deny 10.10.20.0 0.0.0.15",
      "access-list 10 permit any",
    ],
    explanation:
      "/28 correspond au masque 255.255.255.240. La wildcard est 0.0.0.15, car le bloc contient 16 adresses.",
  },
  {
    title: "ACL Standard - Niveau 8",
    difficulty: "Avancé",
    question: "Bloque uniquement l’hôte 192.168.100.50.",
    expected: [
      "access-list 10 deny host 192.168.100.50",
      "access-list 10 permit any",
    ],
    explanation:
      "Le mot-clé host cible une seule adresse IP. C’est équivalent à 192.168.100.50 0.0.0.0.",
  },
  {
    title: "ACL Standard - Niveau 9",
    difficulty: "Avancé",
    question: "Autorise uniquement l’hôte 192.168.1.10.",
    expected: ["access-list 10 permit host 192.168.1.10"],
    explanation:
      "On autorise un seul hôte avec host. Le deny implicite bloque automatiquement toutes les autres sources.",
  },
  {
    title: "ACL Standard - Niveau 10",
    difficulty: "Examen",
    question:
      "Bloque le sous-réseau 192.168.100.96/28 et autorise tout le reste.",
    expected: [
      "access-list 10 deny 192.168.100.96 0.0.0.15",
      "access-list 10 permit any",
    ],
    explanation:
      "/28 donne une wildcard 0.0.0.15. Les blocs avancent de 16 : .0, .16, .32, .48, .64, .80, .96. Le réseau demandé est donc valide.",
  },
];

export default function CiscoPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [showCorrection, setShowCorrection] = useState(false);

  const exercise = exercises[currentIndex];

  function checkAnswer() {
    const normalized = answer.toLowerCase().trim();

    const isCorrect = exercise.expected.every((line) =>
      normalized.includes(line.toLowerCase())
    );

    if (isCorrect) {
      setResult("✅ Bonne réponse ! +10 XP");
      setShowCorrection(false);
    } else {
      setResult(
        "❌ Réponse incorrecte. Vérifie l’adresse réseau, la wildcard ou l’ordre des lignes."
      );
      setShowCorrection(true);
    }
  }

  function nextExercise() {
    setAnswer("");
    setResult("");
    setShowCorrection(false);
    setCurrentIndex((currentIndex + 1) % exercises.length);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Cisco Trainer</h1>

      <div className="bg-slate-800 p-6 rounded-xl max-w-3xl border border-slate-700">
        <p className="text-slate-400 mb-2">
          Question {currentIndex + 1} / {exercises.length}
        </p>

        <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm mb-4">
          {exercise.difficulty}
        </span>

        <h2 className="text-2xl mb-4">{exercise.title}</h2>

        <p className="mb-4 text-slate-200">{exercise.question}</p>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full h-48 p-4 rounded-lg bg-slate-100 text-slate-950 font-mono text-base border-2 border-blue-500 outline-none focus:ring-4 focus:ring-blue-500"
          placeholder={`Exemple :
access-list 10 deny 192.168.20.0 0.0.0.255
access-list 10 permit any`}
        />

        <div className="flex gap-4 mt-4 flex-wrap">
          <button
            onClick={checkAnswer}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
          >
            Vérifier
          </button>

          <button
            onClick={() => setShowCorrection(!showCorrection)}
            className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg"
          >
            {showCorrection ? "Masquer la correction" : "Voir la correction"}
          </button>

          <button
            onClick={nextExercise}
            className="bg-slate-600 hover:bg-slate-700 px-6 py-3 rounded-lg"
          >
            Question suivante
          </button>
        </div>

        {result && (
          <div className="mt-4 text-xl bg-slate-900 p-4 rounded-lg">
            {result}
          </div>
        )}

        {showCorrection && (
          <div className="mt-4 bg-slate-900 border border-amber-500 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Correction</h3>

            <pre className="bg-black text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">
{exercise.expected.join("\n")}
            </pre>

            <h3 className="text-xl font-bold mt-4 mb-2">Explication</h3>
            <p className="text-slate-200">{exercise.explanation}</p>
          </div>
        )}
      </div>
    </main>
  );
}