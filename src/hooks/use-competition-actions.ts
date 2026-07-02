import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const KEY = "nebulalearn_competition_regs";
const PENDING_KEY = "nebulalearn_competition_pending";

function readRegs(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function readPending(): string[] {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function useCompetitionActions() {
  const { user } = useAuth();
  const [registered, setRegistered] = useState<Set<string>>(() => new Set(readRegs()));
  const [pending, setPending] = useState<Set<string>>(() => new Set(readPending()));

  useEffect(() => {
    setRegistered(new Set(readRegs()));
    setPending(new Set(readPending()));
  }, [user]);

  const startRegistration = useCallback((slug: string, url: string) => {
    const nextPending = new Set(readPending());
    nextPending.add(slug);
    localStorage.setItem(PENDING_KEY, JSON.stringify([...nextPending]));
    setPending(nextPending);
    
    // Open external URL
    window.open(url, "_blank");
    toast.info("Opening registration page. Please return here once finished to confirm.", {
      duration: 5000,
    });
  }, []);

  const completeRegistration = useCallback((slug: string, title: string) => {
    // Move from pending to registered
    const nextPending = new Set(readPending());
    nextPending.delete(slug);
    localStorage.setItem(PENDING_KEY, JSON.stringify([...nextPending]));
    setPending(nextPending);

    const nextRegs = new Set(readRegs());
    nextRegs.add(slug);
    localStorage.setItem(KEY, JSON.stringify([...nextRegs]));
    setRegistered(nextRegs);
    
    toast.success(`Registration confirmed for ${title}!`);
  }, []);

  const isRegistered = useCallback((slug: string) => registered.has(slug), [registered]);
  const isPending = useCallback((slug: string) => pending.has(slug), [pending]);

  return { startRegistration, completeRegistration, isRegistered, isPending };
}
