"use client";

import type { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { setMonitoredUser } from "@/shared/observability/error-monitoring";
import { getSupabaseClient } from "./supabase-client";

interface SessionState {
  status: "loading" | "authenticated" | "anonymous";
  session: Session | null;
}

export function useSession(): SessionState {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SessionState>({
    status: "loading",
    session: null,
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let active = true;
    let authChanged = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!active) return;
        authChanged = true;
        if (event === "SIGNED_OUT") {
          queryClient.clear();
        }
        setMonitoredUser(session?.user.id ?? null);
        setState({ status: session ? "authenticated" : "anonymous", session });
      },
    );

    supabase.auth.getSession().then(
      ({ data, error: sessionError }) => {
        if (!active || authChanged) return;
        if (sessionError) {
          setError(sessionError);
          return;
        }
        setMonitoredUser(data.session?.user.id ?? null);
        setState({
          status: data.session ? "authenticated" : "anonymous",
          session: data.session,
        });
      },
      (sessionError: unknown) => {
        if (active) {
          setError(
            sessionError instanceof Error
              ? sessionError
              : new Error("Could not load session"),
          );
        }
      },
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  if (error) throw error;
  return state;
}
