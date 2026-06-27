import { useState } from "react";
import { Cookie, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useHyperdash } from "@/lib/hyperdash-store";

export function Footer() {
  const { cookiesAccepted, acceptCookies } = useHyperdash();
  const [dismissed, setDismissed] = useState(false);

  return (
    <>
      <footer className="mt-24 border-t border-border/60 bg-surface/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} HyperDash. All systems online.</p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--neon-cyan)] shadow-neon-cyan animate-pulse" />
            Server status: nominal
          </p>
        </div>
      </footer>

      {!cookiesAccepted && !dismissed && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2">
          <div className="glass flex items-start gap-3 rounded-2xl border border-border/60 p-4 shadow-elevated">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-[var(--neon-gold)]" />
            <div className="flex-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">We use cookies to remember your stash.</p>
              <p>Progress, coins, and preferences stay on this device.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90" onClick={acceptCookies}>
                Accept
              </Button>
              <button
                aria-label="Dismiss"
                onClick={() => setDismissed(true)}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}