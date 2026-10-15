"use client";

import Button from "@/components/ui/Button";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function GoogleButton({
  className,
  variant = "primary",
}: {
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const { data: session } = useSession();

  return !session ? (
    <Button
      variant={variant}
      className={className}
      onClick={() => signIn("google")}
    >
      <span className="google-mark" aria-hidden="true">
        G
      </span>{" "}
      Continue with Google
    </Button>
  ) : (
    <Button variant={variant} className={className} onClick={() => signOut()}>
      Sign out
    </Button>
  );
}
