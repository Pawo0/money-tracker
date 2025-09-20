"use client";

import { GoogleButton } from "@/components/Button/index";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  console.log("Session data:");
  console.log(session);
  return (
    <div>
      <GoogleButton>Sign In via Google</GoogleButton>
    </div>
  )
}