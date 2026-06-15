"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
type Exercise = {
  title: string;
  difficulty: string;
  question: string;
  expected: string[];
  explanation: string;
};

const standardAclExercises: Exercise[] = [
  {
    title: "ACL Standard - Niveau 1",
    difficulty: "Facile",
    question: "Bloque le réseau RH 192.168.20.0/24.",
    expected: [
      "access-list 10 deny 192.168.20.0 0.0.0.255",
      "access-list 10 permit any",
    ],
    explanation: "/24 = wildcard 0.0.0.255. On ajoute permit any pour autoriser le reste.",
  },
  {
    title: "ACL Standard - Niveau 2",
    difficulty: "Facile",
    question: "Bloque le réseau Invités 192.168.30.0/24.",
    expected: [
      "access-list 10 deny 192.168.30.0 0.0.0.255",
      "access-list 10 permit any",
    ],
    explanation: "/24 = wildcard 0.0.0.255.",
  },
  {
    title: "ACL Standard - Niveau 3",
    difficulty: "Facile",
    question: "Autorise uniquement le réseau Admin 192.168.10.0/24.",
    expected: ["access-list 10 permit 192.168.10.0 0.0.0.255"],
    explanation: "Le deny implicite bloque automatiquement tout le reste.",
  },
  {
    title: "ACL Standard - Niveau 4",
    difficulty: "Facile",
    question: "Bloque le réseau Production 10.0.0.0/24.",
    expected: [
      "access-list 10 deny 10.0.0.0 0.0.0.255",
      "access-list 10 permit any",
    ],
    explanation: "/24 = wildcard 0.0.0.255.",
  },
  {
    title: "ACL Standard - Niveau 5",
    difficulty: "Moyen",
    question: "Bloque le réseau Caméras 192.168.40.0/25.",
    expected: [
      "access-list 10 deny 192.168.40.0 0.0.0.127",
      "access-list 10 permit any",
    ],
    explanation: "/25 = wildcard 0.0.0.127.",
  },
  {
    title: "ACL Standard - Niveau 6",
    difficulty: "Moyen",
    question: "Bloque le réseau Support 192.168.50.64/27.",
    expected: [
      "access-list 10 deny 192.168.50.64 0.0.0.31",
      "access-list 10 permit any",
    ],
    explanation: "/27 = wildcard 0.0.0.31.",
  },
  {
    title: "ACL Standard - Niveau 7",
    difficulty: "Moyen",
    question: "Autorise uniquement le réseau IT 172.16.10.0/24.",
    expected: ["access-list 10 permit 172.16.10.0 0.0.0.255"],
    explanation: "Le deny implicite bloque tout sauf le réseau IT.",
  },
  {
    title: "ACL Standard - Niveau 8",
    difficulty: "Moyen",
    question: "Bloque le réseau WiFi 192.168.60.128/25.",
    expected: [
      "access-list 10 deny 192.168.60.128 0.0.0.127",
      "access-list 10 permit any",
    ],
    explanation: "/25 = wildcard 0.0.0.127.",
  },
  {
    title: "ACL Standard - Niveau 9",
    difficulty: "Moyen",
    question: "Bloque le réseau Stagiaires 192.168.70.0/26.",
    expected: [
      "access-list 10 deny 192.168.70.0 0.0.0.63",
      "access-list 10 permit any",
    ],
    explanation: "/26 = wildcard 0.0.0.63.",
  },
  {
    title: "ACL Standard - Niveau 10",
    difficulty: "Moyen",
    question: "Bloque le réseau Comptabilité 192.168.80.64/26.",
    expected: [
      "access-list 10 deny 192.168.80.64 0.0.0.63",
      "access-list 10 permit any",
    ],
    explanation: "/26 avance par blocs de 64.",
  },
  {
    title: "ACL Standard - Niveau 11",
    difficulty: "Avancé",
    question: "Bloque le réseau Invités 10.10.20.0/28.",
    expected: [
      "access-list 10 deny 10.10.20.0 0.0.0.15",
      "access-list 10 permit any",
    ],
    explanation: "/28 = wildcard 0.0.0.15.",
  },
  {
    title: "ACL Standard - Niveau 12",
    difficulty: "Avancé",
    question: "Bloque uniquement l’hôte 192.168.100.50.",
    expected: [
      "access-list 10 deny host 192.168.100.50",
      "access-list 10 permit any",
    ],
    explanation: "host cible une seule IP.",
  },
  {
    title: "ACL Standard - Niveau 13",
    difficulty: "Avancé",
    question: "Autorise uniquement l’hôte 192.168.1.10.",
    expected: ["access-list 10 permit host 192.168.1.10"],
    explanation: "Le deny implicite bloque toutes les autres sources.",
  },
  {
    title: "ACL Standard - Niveau 14",
    difficulty: "Avancé",
    question: "Bloque le réseau Serveurs 172.16.20.0/26.",
    expected: [
      "access-list 10 deny 172.16.20.0 0.0.0.63",
      "access-list 10 permit any",
    ],
    explanation: "/26 = wildcard 0.0.0.63.",
  },
  {
    title: "ACL Standard - Niveau 15",
    difficulty: "Avancé",
    question: "Bloque le réseau Lab 172.16.30.32/27.",
    expected: [
      "access-list 10 deny 172.16.30.32 0.0.0.31",
      "access-list 10 permit any",
    ],
    explanation: "/27 = wildcard 0.0.0.31.",
  },
  {
    title: "ACL Standard - Niveau 16",
    difficulty: "Avancé",
    question: "Bloque le réseau Test 10.0.5.16/28.",
    expected: [
      "access-list 10 deny 10.0.5.16 0.0.0.15",
      "access-list 10 permit any",
    ],
    explanation: "/28 = wildcard 0.0.0.15.",
  },
  {
    title: "ACL Standard - Niveau 17",
    difficulty: "Examen",
    question: "Bloque le sous-réseau 192.168.100.96/28 et autorise le reste.",
    expected: [
      "access-list 10 deny 192.168.100.96 0.0.0.15",
      "access-list 10 permit any",
    ],
    explanation: "/28 avance par blocs de 16.",
  },
  {
    title: "ACL Standard - Niveau 18",
    difficulty: "Examen",
    question: "Autorise uniquement le réseau Administration 192.168.200.128/25.",
    expected: ["access-list 10 permit 192.168.200.128 0.0.0.127"],
    explanation: "/25 = wildcard 0.0.0.127.",
  },
  {
    title: "ACL Standard - Niveau 19",
    difficulty: "Examen",
    question: "Bloque le réseau Maintenance 10.20.30.64/27 et autorise le reste.",
    expected: [
      "access-list 10 deny 10.20.30.64 0.0.0.31",
      "access-list 10 permit any",
    ],
    explanation: "/27 = wildcard 0.0.0.31.",
  },
  {
    title: "ACL Standard - Niveau 20",
    difficulty: "Examen",
    question: "Bloque uniquement l’hôte 172.16.99.10 et autorise tout le reste.",
    expected: [
      "access-list 10 deny host 172.16.99.10",
      "access-list 10 permit any",
    ],
    explanation: "host permet de cibler une seule machine.",
  },
];

const extendedAclExercises: Exercise[] = [
  {
    title: "ACL Étendue - Niveau 1",
    difficulty: "Facile",
    question: "Autorise 192.168.10.0/24 vers le serveur Web 192.168.100.10 en HTTP.",
    expected: [
      "access-list 100 permit tcp 192.168.10.0 0.0.0.255 host 192.168.100.10 eq 80",
    ],
    explanation: "HTTP utilise TCP port 80.",
  },
  {
    title: "ACL Étendue - Niveau 2",
    difficulty: "Facile",
    question: "Bloque 192.168.30.0/24 vers 192.168.100.10 en SSH.",
    expected: [
      "access-list 100 deny tcp 192.168.30.0 0.0.0.255 host 192.168.100.10 eq 22",
      "access-list 100 permit ip any any",
    ],
    explanation: "SSH utilise TCP port 22.",
  },
  {
    title: "ACL Étendue - Niveau 3",
    difficulty: "Facile",
    question: "Autorise 172.16.10.0/24 à ping le serveur 172.16.100.10.",
    expected: [
      "access-list 100 permit icmp 172.16.10.0 0.0.0.255 host 172.16.100.10",
    ],
    explanation: "Le ping utilise ICMP.",
  },
  {
    title: "ACL Étendue - Niveau 4",
    difficulty: "Facile",
    question: "Bloque tout trafic de 192.168.50.0/24 vers 192.168.10.0/24.",
    expected: [
      "access-list 100 deny ip 192.168.50.0 0.0.0.255 192.168.10.0 0.0.0.255",
      "access-list 100 permit ip any any",
    ],
    explanation: "ip bloque tous les protocoles IP.",
  },
  {
    title: "ACL Étendue - Niveau 5",
    difficulty: "Moyen",
    question: "Autorise 192.168.30.0/24 uniquement vers le DNS 192.168.100.53.",
    expected: [
      "access-list 100 permit udp 192.168.30.0 0.0.0.255 host 192.168.100.53 eq 53",
    ],
    explanation: "DNS utilise principalement UDP 53.",
  },
  {
    title: "ACL Étendue - Niveau 6",
    difficulty: "Moyen",
    question: "Bloque 10.10.20.0/28 vers 10.10.100.10 en HTTPS.",
    expected: [
      "access-list 100 deny tcp 10.10.20.0 0.0.0.15 host 10.10.100.10 eq 443",
      "access-list 100 permit ip any any",
    ],
    explanation: "HTTPS utilise TCP 443. /28 = wildcard 0.0.0.15.",
  },
  {
    title: "ACL Étendue - Niveau 7",
    difficulty: "Moyen",
    question: "Autorise uniquement 192.168.1.10 vers 192.168.100.20 en SSH.",
    expected: [
      "access-list 100 permit tcp host 192.168.1.10 host 192.168.100.20 eq 22",
    ],
    explanation: "host cible une seule IP.",
  },
  {
    title: "ACL Étendue - Niveau 8",
    difficulty: "Moyen",
    question: "Bloque 192.168.1.50 vers 192.168.100.10 en HTTP.",
    expected: [
      "access-list 100 deny tcp host 192.168.1.50 host 192.168.100.10 eq 80",
      "access-list 100 permit ip any any",
    ],
    explanation: "HTTP utilise TCP 80.",
  },
  {
    title: "ACL Étendue - Niveau 9",
    difficulty: "Moyen",
    question: "Autorise 192.168.20.0/24 vers 192.168.100.10 en HTTP et HTTPS.",
    expected: [
      "access-list 100 permit tcp 192.168.20.0 0.0.0.255 host 192.168.100.10 eq 80",
      "access-list 100 permit tcp 192.168.20.0 0.0.0.255 host 192.168.100.10 eq 443",
    ],
    explanation: "HTTP = 80, HTTPS = 443.",
  },
  {
    title: "ACL Étendue - Niveau 10",
    difficulty: "Moyen",
    question: "Bloque 192.168.60.0/24 vers le DNS 192.168.100.53.",
    expected: [
      "access-list 100 deny udp 192.168.60.0 0.0.0.255 host 192.168.100.53 eq 53",
      "access-list 100 permit ip any any",
    ],
    explanation: "DNS = UDP 53.",
  },
  {
    title: "ACL Étendue - Niveau 11",
    difficulty: "Avancé",
    question: "Bloque Invités 192.168.30.0/24 vers Admin 192.168.10.0/24.",
    expected: [
      "access-list 100 deny ip 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255",
      "access-list 100 permit ip any any",
    ],
    explanation: "On bloque tout protocole IP entre les deux réseaux.",
  },
  {
    title: "ACL Étendue - Niveau 12",
    difficulty: "Avancé",
    question: "Autorise Support 192.168.50.64/27 vers 192.168.100.10 en RDP.",
    expected: [
      "access-list 100 permit tcp 192.168.50.64 0.0.0.31 host 192.168.100.10 eq 3389",
    ],
    explanation: "RDP utilise TCP 3389.",
  },
  {
    title: "ACL Étendue - Niveau 13",
    difficulty: "Avancé",
    question: "Bloque 172.16.30.32/27 vers 172.16.100.10 en SSH.",
    expected: [
      "access-list 100 deny tcp 172.16.30.32 0.0.0.31 host 172.16.100.10 eq 22",
      "access-list 100 permit ip any any",
    ],
    explanation: "/27 = wildcard 0.0.0.31.",
  },
  {
    title: "ACL Étendue - Niveau 14",
    difficulty: "Avancé",
    question: "Autorise 10.0.5.16/28 vers 10.0.100.10 en HTTPS.",
    expected: [
      "access-list 100 permit tcp 10.0.5.16 0.0.0.15 host 10.0.100.10 eq 443",
    ],
    explanation: "/28 = wildcard 0.0.0.15.",
  },
  {
    title: "ACL Étendue - Niveau 15",
    difficulty: "Avancé",
    question: "Bloque l’hôte 192.168.100.50 vers toutes les destinations.",
    expected: [
      "access-list 100 deny ip host 192.168.100.50 any",
      "access-list 100 permit ip any any",
    ],
    explanation: "any signifie toutes les destinations.",
  },
  {
    title: "ACL Étendue - Niveau 16",
    difficulty: "Avancé",
    question: "Autorise uniquement le serveur 192.168.100.10 vers Internet.",
    expected: ["access-list 100 permit ip host 192.168.100.10 any"],
    explanation: "Source unique vers n’importe quelle destination.",
  },
  {
    title: "ACL Étendue - Niveau 17",
    difficulty: "Examen",
    question: "Bloque 192.168.100.96/28 vers 192.168.200.10 en SSH.",
    expected: [
      "access-list 100 deny tcp 192.168.100.96 0.0.0.15 host 192.168.200.10 eq 22",
      "access-list 100 permit ip any any",
    ],
    explanation: "/28 = wildcard 0.0.0.15. SSH = 22.",
  },
  {
    title: "ACL Étendue - Niveau 18",
    difficulty: "Examen",
    question: "Autorise Admin 192.168.10.0/24 vers 192.168.100.10 en SSH, HTTP et HTTPS.",
    expected: [
      "access-list 100 permit tcp 192.168.10.0 0.0.0.255 host 192.168.100.10 eq 22",
      "access-list 100 permit tcp 192.168.10.0 0.0.0.255 host 192.168.100.10 eq 80",
      "access-list 100 permit tcp 192.168.10.0 0.0.0.255 host 192.168.100.10 eq 443",
    ],
    explanation: "Il faut une ligne par port.",
  },
  {
    title: "ACL Étendue - Niveau 19",
    difficulty: "Examen",
    question: "Bloque Invités 192.168.30.0/24 vers 192.168.10.0/24 et 192.168.20.0/24.",
    expected: [
      "access-list 100 deny ip 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255",
      "access-list 100 deny ip 192.168.30.0 0.0.0.255 192.168.20.0 0.0.0.255",
      "access-list 100 permit ip any any",
    ],
    explanation: "Deux deny, puis permit ip any any.",
  },
  {
    title: "ACL Étendue - Niveau 20",
    difficulty: "Examen",
    question: "Autorise 192.168.40.0/25 vers DNS 192.168.100.53 et Web 192.168.100.10.",
    expected: [
      "access-list 100 permit udp 192.168.40.0 0.0.0.127 host 192.168.100.53 eq 53",
      "access-list 100 permit tcp 192.168.40.0 0.0.0.127 host 192.168.100.10 eq 80",
      "access-list 100 permit tcp 192.168.40.0 0.0.0.127 host 192.168.100.10 eq 443",
    ],
    explanation: "DNS = UDP 53. HTTP = 80. HTTPS = 443.",
  },
];

function getBadge(correctAnswers: number) {
  if (correctAnswers >= 100) return "🥷 Ninja ACL";
  if (correctAnswers >= 50) return "🏆 ACL Expert";
  if (correctAnswers >= 20) return "🥇 ACL Specialist";
  if (correctAnswers >= 5) return "🥉 ACL Recruit";
  return "🚀 Débutant";
}

export default function CiscoPage() {
  const [selectedTheme, setSelectedTheme] = useState("standard");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [showCorrection, setShowCorrection] = useState(false);
  const [xp, setXp] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [examMode, setExamMode] = useState(false);
const [examScore, setExamScore] = useState(0);
const [examAnswered, setExamAnswered] = useState(0);
const [examFinished, setExamFinished] = useState(false);
const [timeLeft, setTimeLeft] = useState(900);
const [examBonus, setExamBonus] = useState(0);
const [completedExams, setCompletedExams] = useState(0);
const [passedExams, setPassedExams] = useState(0);
const [bestExamScore, setBestExamScore] = useState(0);
const [timerRunning, setTimerRunning] = useState(false);
useEffect(() => {
  if (!timerRunning) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
  finishExam(examScore);
  return 0;
}

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [timerRunning]);
useEffect(() => {
  async function loadProgress() {
    try {
      const docRef = doc(db, "users", "test-user");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setXp(data.xp || 0);
        setCorrectAnswers(data.correctAnswers || 0);
        setStreak(data.streak || 0);
        setBestStreak(data.bestStreak || 0);
        setCompletedExams(data.completedExams || 0);
        setPassedExams(data.passedExams || 0);
        setBestExamScore(data.bestExamScore || 0);
      }
    } catch (error) {
      console.error("Erreur chargement :", error);
    }
  }

  loadProgress();
}, []);
  const exercises =
    selectedTheme === "extended" ? extendedAclExercises : standardAclExercises;

  const exercise = exercises[currentIndex];
  function calculateExamBonus(score: number) {
  if (score === 10) return 100;
  if (score === 9) return 75;
  if (score === 8) return 50;
  if (score === 7) return 25;
  return 0;
}

function finishExam(finalScore: number) {
  const bonus = calculateExamBonus(finalScore);

  setExamFinished(true);
  setTimerRunning(false);
  setExamBonus(bonus);
  setCompletedExams(completedExams + 1);

  if (finalScore >= 7) {
    setPassedExams(passedExams + 1);
  }

  if (finalScore > bestExamScore) {
    setBestExamScore(finalScore);
  }

  if (bonus > 0) {
    setXp(xp + bonus);
  }

  saveProgress();
}

async function saveProgress() {
  try {
    await setDoc(
      doc(db, "users", "test-user"),
      {
        xp,
        correctAnswers,
        streak,
        bestStreak,
        completedExams,
        passedExams,
        bestExamScore,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Erreur sauvegarde :", error);
  }
}
  function checkAnswer() {
    const normalized = answer.toLowerCase();

    const isCorrect = exercise.expected.every((line) =>
      normalized.includes(line.toLowerCase())
    );

    if (isCorrect) {
      const newStreak = streak + 1;
      setXp(xp + 10);
      setCorrectAnswers(correctAnswers + 1);
      if (examMode) {
  setExamScore(examScore + 1);
}
      setStreak(newStreak);

      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }

      setResult(`✅ Bonne réponse ! +10 XP | 🔥 Série : ${newStreak}`);
      setShowCorrection(false);
    } else {
      setStreak(0);
      setResult("❌ Réponse incorrecte. Série remise à zéro.");
      setShowCorrection(true);
    }
    if (examMode) {
  const newAnswered = examAnswered + 1;

  setExamAnswered(newAnswered);

if (newAnswered >= 10) {
  const finalScore = isCorrect ? examScore + 1 : examScore;
  finishExam(finalScore);
}
}
  }
function startExam() {
  setExamMode(true);
  setExamScore(0);
  setExamAnswered(0);
  setExamFinished(false);
  setTimeLeft(900);
setTimerRunning(true);
setExamBonus(0);

  setAnswer("");
  setResult("");
  setShowCorrection(false);

  const randomIndex = Math.floor(
    Math.random() * exercises.length
  );

  setCurrentIndex(randomIndex);
}

function stopExam() {
  setExamMode(false);
  setExamFinished(false);
  setExamScore(0);
  setExamAnswered(0);
  setTimerRunning(false);
}
  function nextExercise() {
    setAnswer("");
    setResult("");
    setShowCorrection(false);
    const randomIndex = Math.floor(Math.random() * exercises.length);
    setCurrentIndex(randomIndex);
  }

  function changeTheme(theme: string) {
    setSelectedTheme(theme);
    setCurrentIndex(0);
    setAnswer("");
    setResult("");
    setShowCorrection(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-8 flex justify-center">
      <div className="w-full max-w-5xl">
        <Link
  href="/"
  className="inline-block bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
>
  🏠 Accueil
</Link>
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3">Cisco Trainer</h1>
          <p className="text-slate-400">
            Entraînement ACL progressif pour TSSR / CCNA
          </p>

          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl">🏆 XP : <strong>{xp}</strong></div>
            <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl">✅ Bonnes réponses : <strong>{correctAnswers}</strong></div>
            <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl">⭐ Niveau : <strong>{Math.floor(xp / 100) + 1}</strong></div>
            <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl">🏅 Badge : <strong>{getBadge(correctAnswers)}</strong></div>
            <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl">🔥 Série : <strong>{streak}</strong></div>
            <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl">👑 Meilleure série : <strong>{bestStreak}</strong></div>
            <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl">
  🎯 Examens : <strong>{completedExams}</strong>
</div>

<div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl">
  ✅ Réussis : <strong>{passedExams}</strong>
</div>

<div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl">
  🏆 Meilleur score : <strong>{bestExamScore}/10</strong>
</div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => changeTheme("standard")}
            className={`p-4 rounded-xl border text-left ${
              selectedTheme === "standard"
                ? "bg-blue-600 border-blue-400"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <p className="text-xl font-bold">📡 ACL Standard</p>
            <p className="text-sm text-slate-200">20 exercices</p>
          </button>

          <button
            onClick={() => changeTheme("extended")}
            className={`p-4 rounded-xl border text-left ${
              selectedTheme === "extended"
                ? "bg-cyan-600 border-cyan-400"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <p className="text-xl font-bold">🔒 ACL Étendue</p>
            <p className="text-sm text-slate-200">20 exercices</p>
          </button>
        </section>
        <div className="text-center mb-8">
  <button
    onClick={startExam}
    className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold"
  >
    🎯 Lancer le Mode Examen
  </button>
</div>
        <section className="bg-slate-800 p-8 rounded-2xl border border-slate-700 mx-auto max-w-3xl">
          {examMode && (
  <div className="mb-5 bg-red-950 border border-red-500 p-4 rounded-xl text-center">
    <p className="font-bold text-lg">🎯 Mode Examen</p>
    <p>
      Question {examAnswered + 1} / 10 | Score : {examScore} / 10
    </p>
    <p className="mt-2 text-xl font-bold">
  ⏱️ {Math.floor(timeLeft / 60)}:
  {(timeLeft % 60).toString().padStart(2, "0")}
  <button
  onClick={stopExam}
  className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
>
  ❌ Quitter l'examen
</button>
</p>
  </div>
)}
          <div className="flex justify-between mb-4">
            <p className="text-slate-400">
              Question {currentIndex + 1} / {exercises.length}
            </p>
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
              {exercise.difficulty}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-4">{exercise.title}</h2>
          <p className="mb-6 text-lg text-slate-200">{exercise.question}</p>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full h-52 p-4 rounded-xl bg-white text-black font-mono border-2 border-blue-500"
            placeholder="Tape ta configuration Cisco ici..."
          />

          <div className="flex gap-4 mt-4 flex-wrap justify-center">
            <button onClick={checkAnswer} className="bg-blue-600 px-6 py-3 rounded-lg font-semibold">Vérifier</button>
            {!examMode && (
  <button
    onClick={() => setShowCorrection(!showCorrection)}
    className="bg-amber-600 px-6 py-3 rounded-lg font-semibold"
  >
    Voir la correction
  </button>
)}
            <button onClick={nextExercise} className="bg-slate-600 px-6 py-3 rounded-lg font-semibold">Question suivante</button>
          </div>

          {result && (
            <div className="mt-5 bg-slate-900 p-4 rounded-lg text-center text-xl">
              {result}
            </div>
          )}
          {examFinished && (
  <div className="mt-5 bg-slate-900 border border-red-500 p-5 rounded-xl text-center">
    <h3 className="text-2xl font-bold mb-3">Résultat Examen</h3>

    <p className="text-xl mb-2">
      Score : {examScore} / 10
    </p>
    <p className="text-xl mb-2 text-yellow-400 font-bold">
  🎁 Bonus XP : +{examBonus}
</p>

    <p className="text-xl mb-4">
      {examScore >= 7 ? "✅ Examen réussi" : "❌ Examen échoué"}
    </p>

    <button
      onClick={stopExam}
      className="bg-slate-600 hover:bg-slate-700 px-6 py-3 rounded-lg font-semibold"
    >
      Quitter le mode examen
    </button>
  </div>
)}

          {showCorrection && (
            <div className="mt-5 bg-slate-900 border border-amber-500 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Correction</h3>
              <pre className="bg-black text-green-400 p-4 rounded-lg overflow-x-auto">
                {exercise.expected.join("\n")}
              </pre>
              <h3 className="text-xl font-bold mt-4 mb-2">Explication</h3>
              <p>{exercise.explanation}</p>
            </div>
          )}
        </section>
        
      </div>
    </main>
  );
}