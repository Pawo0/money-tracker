"use client"

import Button from "./Button";
import {signIn, signOut} from "next-auth/react";
import {useSession} from "next-auth/react";

export default function GoogleButton({className, variant = 'primary'}: {
  variant?: 'primary' | 'secondary',
  className?: string
}) {
  const {data: session} = useSession();

  return (
    !session ?
      <Button variant={variant} className={className} onClick={() => signIn("google")}>
        Sign In with Google
      </Button> :
      <Button variant={variant} className={className} onClick={() => signOut()}>
        Sign Out
      </Button>

  )
}
