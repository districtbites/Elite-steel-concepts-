"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// The modal's code is downloaded only when it is about to open, so it adds
// nothing to the page's initial JavaScript or hydration work.
const ApplicationModal = dynamic(() => import("./ApplicationModal"), { ssr: false });

const STORAGE_KEY = "has_seen_application_modal_v1";
const OPEN_DELAY_MS = 8000;

export default function DeferredApplicationModal() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — still show the modal once.
    }
    const timer = setTimeout(() => setReady(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return ready ? <ApplicationModal storageKey={STORAGE_KEY} /> : null;
}
