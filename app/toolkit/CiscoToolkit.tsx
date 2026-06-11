"use client";

import { useState } from "react";

export default function CiscoToolkit() {
  const [aclNumber, setAclNumber] = useState("100");
  const [action, setAction] = useState("permit");
  const [protocol, setProtocol] = useState("tcp");
  const [source, setSource] = useState("192.168.10.0");
  const [sourceWildcard, setSourceWildcard] = useState("0.0.0.255");
  const [destination, setDestination] = useState("192.168.100.10");
  const [port, setPort] = useState("80");
  const [cidr, setCidr] = useState("/24");

  const generatedAcl = `access-list ${aclNumber} ${action} ${protocol} ${source} ${sourceWildcard} host ${destination} eq ${port}`;
const wildcardMap: Record<string, string> = {
  "/24": "0.0.0.255",
  "/25": "0.0.0.127",
  "/26": "0.0.0.63",
  "/27": "0.0.0.31",
  "/28": "0.0.0.15",
  "/29": "0.0.0.7",
  "/30": "0.0.0.3",
};

const maskMap: Record<string, string> = {
  "/24": "255.255.255.0",
  "/25": "255.255.255.128",
  "/26": "255.255.255.192",
  "/27": "255.255.255.224",
  "/28": "255.255.255.240",
  "/29": "255.255.255.248",
  "/30": "255.255.255.252",
};

const hostsMap: Record<string, string> = {
  "/24": "254",
  "/25": "126",
  "/26": "62",
  "/27": "30",
  "/28": "14",
  "/29": "6",
  "/30": "2",
};
  async function copyAcl() {
    await navigator.clipboard.writeText(generatedAcl);
    alert("Commande ACL copiée !");
  }

  return (
    <section className="bg-slate-800 p-8 rounded-2xl border border-slate-700 mx-auto max-w-3xl mt-8">
      <h2 className="text-3xl font-bold mb-4">📡 Générateur ACL Cisco</h2>

      <p className="text-slate-300 mb-6">
        Remplis les champs ci-dessous pour générer automatiquement une syntaxe ACL étendue Cisco.
      </p>

      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl mb-6">
        <h3 className="text-xl font-bold mb-2">Exemple concret</h3>
        <p className="text-slate-300">
          Autoriser le réseau <strong>192.168.10.0/24</strong> à accéder au serveur web
          <strong> 192.168.100.10</strong> en HTTP.
        </p>
        <p className="text-slate-400 mt-2">
          Résultat : access-list 100 permit tcp 192.168.10.0 0.0.0.255 host 192.168.100.10 eq 80
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-2">
          <span className="font-semibold">Numéro ACL</span>
          <p className="text-sm text-slate-400">
            Pour une ACL étendue Cisco, utilise souvent 100 à 199.
          </p>
          <input
            value={aclNumber}
            onChange={(e) => setAclNumber(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
            placeholder="Ex : 100"
          />
        </label>

        <label className="space-y-2">
          <span className="font-semibold">Action</span>
          <p className="text-sm text-slate-400">
            permit = autoriser, deny = bloquer.
          </p>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
          >
            <option value="permit">permit</option>
            <option value="deny">deny</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="font-semibold">Protocole</span>
          <p className="text-sm text-slate-400">
            tcp = HTTP/SSH/RDP, udp = DNS/DHCP, icmp = ping, ip = tout trafic IP.
          </p>
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
          >
            <option value="ip">ip</option>
            <option value="tcp">tcp</option>
            <option value="udp">udp</option>
            <option value="icmp">icmp</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="font-semibold">Adresse source</span>
          <p className="text-sm text-slate-400">
            Réseau ou machine qui envoie le trafic.
          </p>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
            placeholder="Ex : 192.168.10.0"
          />
        </label>

        <label className="space-y-2">
          <span className="font-semibold">Wildcard source</span>
          <p className="text-sm text-slate-400">
            Exemple : 0.0.0.255 pour /24, 0.0.0.31 pour /27.
          </p>
          <input
            value={sourceWildcard}
            onChange={(e) => setSourceWildcard(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
            placeholder="Ex : 0.0.0.255"
          />
        </label>

        <label className="space-y-2">
          <span className="font-semibold">Destination</span>
          <p className="text-sm text-slate-400">
            Adresse du serveur ou de la machine cible.
          </p>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
            placeholder="Ex : 192.168.100.10"
          />
        </label>

        <label className="space-y-2">
          <span className="font-semibold">Port</span>
          <p className="text-sm text-slate-400">
            80 = HTTP, 443 = HTTPS, 22 = SSH, 53 = DNS, 3389 = RDP.
          </p>
          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
            placeholder="Ex : 80"
          />
        </label>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">Commande générée</h3>

        <div className="bg-black text-green-400 p-4 rounded-lg font-mono overflow-x-auto">
          {generatedAcl}
        </div>

        <button
          onClick={copyAcl}
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
        >
          📋 Copier la commande
        </button>
      </div>
      <div className="mt-10 border-t border-slate-700 pt-8">
  <h2 className="text-3xl font-bold mb-4">
    🧮 Wildcard Calculator
  </h2>

  <p className="text-slate-300 mb-4">
    Choisis un CIDR pour obtenir rapidement le masque, la wildcard et le nombre d'hôtes.
  </p>

  <select
    value={cidr}
    onChange={(e) => setCidr(e.target.value)}
    className="p-3 rounded bg-white text-black"
  >
    <option value="/24">/24</option>
    <option value="/25">/25</option>
    <option value="/26">/26</option>
    <option value="/27">/27</option>
    <option value="/28">/28</option>
    <option value="/29">/29</option>
    <option value="/30">/30</option>
  </select>

  <div className="mt-6 bg-slate-900 border border-slate-700 p-5 rounded-xl">
    <p>
      <strong>Masque :</strong> {maskMap[cidr]}
    </p>

    <p className="mt-2">
      <strong>Wildcard :</strong> {wildcardMap[cidr]}
    </p>

    <p className="mt-2">
      <strong>Hôtes utilisables :</strong> {hostsMap[cidr]}
    </p>
  </div>
</div>
    </section>
  );
}
