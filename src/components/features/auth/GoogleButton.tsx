"use client";
import Button from "@/components/ui/Button";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";
export default function GoogleButton({
  className,
  variant = "primary",
}: {
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const { data: session } = useSession();
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() =>
        session ? signOut() : signIn("google", { callbackUrl: "/dashboard" })
      }
    >
      {session ? <LogOut size={16} /> : <LogIn size={16} />}{" "}
      {session ? "Sign out" : "Sign in with Google"}
    </Button>
  );
}
