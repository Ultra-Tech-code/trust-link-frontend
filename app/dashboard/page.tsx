"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import DashboardSection from "@/components/dashboard/DashboardSection";
import { Skeleton } from "@/components/ui/Skeleton";
import NotificationBell from "@/components/notifications/NotificationBell";

function UpgradeBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="alert"
      className="mb-6 flex items-start justify-between gap-4 rounded-2xl bg-amber-50 px-5 py-4 dark:bg-amber-950/30"
    >
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            Welcome to Pro!
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Your account has been upgraded. Enjoy unlimited escrows, the analytics
            dashboard, and priority support.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded-full p-1 text-amber-600 transition hover:bg-amber-100 dark:hover:bg-amber-900/40"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const didStrip = useRef(false);

  useEffect(() => {
    const storedJwt = window.localStorage.getItem("wallet.jwt");
    if (!storedJwt) {
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show banner once on ?upgraded=1, then strip the param from the URL
  useEffect(() => {
    if (searchParams.get("upgraded") === "1" && !didStrip.current) {
      didStrip.current = true;
      setShowUpgradeBanner(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("upgraded");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  if (isChecking) {
    return (
      <main className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="mb-6 h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-semibold text-zinc-950 dark:text-white">
          Dashboard
        </h1>
        {showUpgradeBanner && (
          <UpgradeBanner onDismiss={() => setShowUpgradeBanner(false)} />
        )}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-zinc-950 dark:text-white">Dashboard</h1>
          <NotificationBell />
        </div>
        <ErrorBoundary>
          <DashboardSection />
        </ErrorBoundary>
      </div>
    </main>
  );
}
