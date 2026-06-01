<<<<<<< main
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { getEscrow } from "@/lib/api";
import PaymentClient from "./PaymentClient";
=======
import { getEscrow } from "@/lib/api";
import { PaymentEscrowClient } from "./PaymentEscrowClient";
>>>>>>> main

interface PayPageProps {
  params: Promise<{ escrowId: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
  const { escrowId } = await params;

<<<<<<< main
  let escrow;
  try {
    escrow = await getEscrow(escrowId);
  } catch {
    return (
      <main className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
        <div className="mx-auto max-w-lg">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950">
            <h1 className="mb-2 text-2xl font-semibold text-red-900 dark:text-red-100">
              Order Not Found
            </h1>
            <p className="text-red-700 dark:text-red-300">
              We couldn&apos;t find an escrow with ID: <span className="font-mono">{escrowId}</span>
            </p>
          </div>
=======
  try {
    const escrow = await getEscrow(escrowId);

    return (
      <main className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
        <div className="mx-auto max-w-4xl">
          <PaymentEscrowClient escrow={escrow} escrowId={escrowId} />
        </div>
      </main>
    );
  } catch {
    return (
      <main className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
        <div className="mx-auto max-w-4xl">
          <section className="rounded-3xl border border-red-300 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
            <h1 className="text-2xl font-semibold text-red-800 dark:text-red-200">Escrow Not Found</h1>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              We could not find an escrow with ID: <span className="font-mono">{escrowId}</span>
            </p>
          </section>
>>>>>>> main
        </div>
      </main>
    );
  }
<<<<<<< main

  return (
    <main className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-950 dark:text-white">
            Pay for {escrow.item}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Secured by TrustLink escrow
          </p>
        </div>
        <ErrorBoundary>
          <PaymentClient escrow={escrow} />
        </ErrorBoundary>
      </div>
    </main>
  );
=======
>>>>>>> main
}
