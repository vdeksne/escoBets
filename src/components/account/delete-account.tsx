"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeleteAccountProps = {
  onDeleteAccount: () => void | Promise<void>;
  className?: string;
};

/**
 * Danger zone: delete account with two confirmation dialogs before calling the API.
 */
export function DeleteAccount({ onDeleteAccount, className }: DeleteAccountProps) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleClick() {
    setError(null);
    const first = window.confirm(
      "Delete your account permanently?\n\n" +
        "This will remove your profile, sign-in access, and associated data stored in our systems. " +
        "This action cannot be undone.\n\n" +
        "Click OK to continue to the next step."
    );
    if (!first) return;

    const second = window.confirm(
      "Final confirmation\n\n" +
        "Your account will be deleted immediately. You will lose access to subscriptions, " +
        "saved progress, and all account data.\n\n" +
        "Are you absolutely sure you want to delete your account?"
    );
    if (!second) return;

    setBusy(true);
    try {
      await onDeleteAccount();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className={cn(
        "rounded-xl border border-red-500/30 bg-red-950/20 p-6",
        className
      )}
    >
      <div className="flex gap-3">
        <AlertTriangle
          className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-gotham text-lg font-semibold text-red-200">
            Delete account
          </h2>
          <p className="mt-2 font-gotham text-sm text-white/70">
            Once you delete your account, there is no going back. You will be asked to confirm
            twice before your account is removed.
          </p>
          {error ? (
            <p className="mt-3 font-gotham text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => void handleClick()}
            className="mt-4 border-red-500/60 bg-red-950/40 font-gotham text-red-100 hover:bg-red-950/70 hover:text-white"
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                Deleting…
              </>
            ) : (
              "Delete my account"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
