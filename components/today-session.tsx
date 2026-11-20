"use client";

import { useLayoutEffect, useRef } from "react";

export function TodaySession() {
  const marked = useRef(false);
  useLayoutEffect(() => {
    if (marked.current) return;
    marked.current = true;
    try {
      if (sessionStorage.getItem("studium-today")) document.documentElement.dataset.seenToday = "";
      sessionStorage.setItem("studium-today", "1");
    } catch {}
  }, []);
  return null;
}
