import { useEffect, useState } from "react";

import { formatLocalTime } from "../utils/dateTime";

export function useLocalTime(timezone?: string): string {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return formatLocalTime(timezone, now);
}
