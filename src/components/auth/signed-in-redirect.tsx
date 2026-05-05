"use client";

import { useUser } from "@clerk/nextjs";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SignedInRedirect({ to }: { to: Route }) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(to);
    }
  }, [isLoaded, isSignedIn, router, to]);

  return null;
}
