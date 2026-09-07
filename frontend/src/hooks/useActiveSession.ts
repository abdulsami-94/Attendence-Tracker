import { useState, useEffect, useRef, useCallback } from 'react';
import { sessionService, Session } from '../services/session.service';

const POLL_INTERVAL_MS = 10000;

export function useActiveSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const requestInFlight = useRef(false);
  const isMounted = useRef(true);

  const poll = useCallback(async () => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;

    try {
      const data = await sessionService.getCurrentSession();
      if (isMounted.current) setSession(data);
    } catch (err: any) {
      // 404 means "no session live right now" — that's a normal, expected
      // state for a polling hook, not a failure. Don't treat it as an error.
      if (err.response?.status === 404) {
        if (isMounted.current) setSession(null);
      } else {
        console.error('Session poll error:', err);
      }
    } finally {
      requestInFlight.current = false;
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    poll(); // fire immediately on mount, don't wait 10s for the first check
    const interval = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [poll]);

  // Bug #4 fix: expose refresh so callers (e.g. DashboardScreen on focus) can
  // trigger an immediate re-poll instead of waiting up to 10 seconds for the
  // interval to fire after the user returns from MarkAttendanceScreen.
  const refresh = useCallback(() => {
    poll();
  }, [poll]);

  return { session, loading, refresh };
}