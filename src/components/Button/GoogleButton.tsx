"use client"

import Button from "./Button";
import {signIn} from "next-auth/react";

export default function GoogleButton({children}: {children: React.ReactNode}) {
  return (
    <Button onClick={() => signIn("google")}>
      {children}
    </Button>
  )
}
