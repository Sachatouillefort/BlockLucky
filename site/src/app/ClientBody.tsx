"use client";

import { useEffect } from "react";
import Script from "next/script";
import { Web3Provider } from "@/components/Web3Provider";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased dark";
  }, []);

  return (
    <>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased dark">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </>
  );
}
