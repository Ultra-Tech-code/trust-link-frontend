import * as Sentry from "@sentry/nextjs";

export function setEscrowContext(escrowId: string) {
  Sentry.setTag("escrow.id", escrowId);
}

export interface WalletErrorContext {
  xdr?: string;
  contractId?: string;
  network?: string;
  action?: string;
  [key: string]: unknown;
}

export function captureWalletError(error: Error, context: WalletErrorContext) {
  Sentry.captureException(error, {
    contexts: {
      transaction: context,
    },
  });
}

export default Sentry;
