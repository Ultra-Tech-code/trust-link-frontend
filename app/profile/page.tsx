"use client";

import { useWallet } from "@/components/providers/WalletProvider";

export default function ProfilePage() {
  const { publicKey, disconnect } = useWallet();

  return (
    <main className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-semibold text-zinc-950 dark:text-white">Profile</h1>
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          {publicKey ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Wallet Address</p>
                <p className="mt-1 break-all font-mono text-sm text-zinc-950 dark:text-zinc-100">
                  {publicKey}
                </p>
              </div>
              <button
                onClick={disconnect}
                className="rounded-2xl border-2 border-red-600 bg-transparent px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-950"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400">No wallet connected.</p>
          )}
        </div>
      </div>
    </main>
  );
}
