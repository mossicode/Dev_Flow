"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function HomeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => router.refresh();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);

  return null;
}

export default HomeRefresh;
