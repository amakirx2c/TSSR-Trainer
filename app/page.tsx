"use client";

import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, googleProvider } from "../lib/firebase";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);

  async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
  } catch (error) {
    console.error("Erreur connexion Google :", error);
    alert("Erreur connexion Google. Regarde la console avec F12.");
  }
}
  
  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-4">TSSR Trainer</h1>

      <p className="text-xl text-slate-300 mb-8">
        Cisco • Linux • Windows Server
      </p>

      {!user ? (
        <button
          onClick={loginWithGoogle}
          className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold"
        >
          Se connecter avec Google
        </button>
      ) : (
        <div className="text-center">
          <p className="mb-4">
            Connecté en tant que <strong>{user.displayName}</strong>
          </p>

          <div className="flex gap-4 justify-center mb-6">
            <button className="bg-blue-600 px-6 py-3 rounded-lg">Cisco</button>
            <button className="bg-green-600 px-6 py-3 rounded-lg">Linux</button>
            <button className="bg-purple-600 px-6 py-3 rounded-lg">Windows</button>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded-lg"
          >
            Déconnexion
          </button>
        </div>
      )}
    </main>
  );
}