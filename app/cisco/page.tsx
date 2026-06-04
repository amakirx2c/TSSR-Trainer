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
  },
  {
    title: "ACL Standard - Niveau 2",
    difficulty: "Facile",
    question: "Bloque le réseau Invités 192.168.30.0/24.",
    expected: [
      "access-list 10 deny 192.168.30.0 0.0.0.255",
      "access-list 10 permit any",
    ],
  },
  {
    title: "ACL Standard - Niveau 3",
    difficulty: "Facile",
    question: "Autorise uniquement le réseau Admin 192.168.10.0/24.",
    expected: [
      "access-list 10 permit 192.168.10.0 0.0.0.255",
    ],
  },
  {
    title: "ACL Standard - Niveau 4",
    difficulty: "Moyen",
    question: "Bloque le réseau Caméras 192.168.40.0/25.",
    expected: [
      "access-list 10 deny 192.168.40.0 0.0.0.127",
      "access-list 10 permit any",
    ],
  },
  {
    title: "ACL Standard - Niveau 5",
    difficulty: "Moyen",
    question: "Bloque le réseau Support 192.168.50.64/27.",
    expected: [
      "access-list 10 deny 192.168.50.64 0.0.0.31",
      "access-list 10 permit any",
    ],
  },
  {
    title: "ACL Standard - Niveau 6",
    difficulty: "Moyen",
    question: "Autorise uniquement le réseau IT 172.16.10.0/24.",
    expected: [
      "access-list 10 permit 172.16.10.0 0.0.0.255",
    ],
  },
  {
    title: "ACL Standard - Niveau 7",
    difficulty: "Avancé",
    question: "Bloque le réseau Invités 10.10.20.0/28.",
    expected: [
      "access-list 10 deny 10.10.20.0 0.0.0.15",
      "access-list 10 permit any",
    ],
  },
  {
    title: "ACL Standard - Niveau 8",
    difficulty: "Avancé",
    question: "Bloque uniquement l’hôte 192.168.100.50.",
    expected: [
      "access-list 10 deny host 192.168.100.50",
      "access-list 10 permit any",
    ],
  },
  {
    title: "ACL Standard - Niveau 9",
    difficulty: "Avancé",
    question: "Autorise uniquement l’hôte 192.168.1.10.",
    expected: [
      "access-list 10 permit host 192.168.1.10",
    ],
  },
  {
    title: "ACL Standard - Niveau 10",
    difficulty: "Examen",
    question: "Bloque le sous-réseau 192.168.100.96/28 et autorise tout le reste.",
    expected: [
      "access-list 10 deny 192.168.100.96 0.0.0.15",
      "access-list 10 permit any",
    ],
  },
];

export default function CiscoPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");

  const exercise = exercises[currentIndex];

  function checkAnswer() {
    const normalized = answer.toLowerCase().trim();

    const isCorrect = exercise.expected.every((line) =>
      normalized.includes(line.toLowerCase())
    );

    if (isCorrect) {
      setResult("✅ Bonne réponse ! +10 XP");
    } else {
      setResult("❌ Réponse incorrecte. Vérifie l’adresse réseau, la wildcard ou l’ordre des lignes.");
    }
  }

  function nextExercise() {
    setAnswer("");
    setResult("");
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
          placeholder="Exemple :
access-list 10 deny 192.168.20.0 0.0.0.255
access-list 10 permit any"
        />

        <div className="flex gap-4 mt-4">
          <button
            onClick={checkAnswer}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
          >
            Vérifier
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
      </div>
    </main>
  );
}