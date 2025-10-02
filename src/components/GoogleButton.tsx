"use client"

import Button from "./Button";
import {signIn, signOut} from "next-auth/react";
import {useSession} from "next-auth/react";

export default function GoogleButton({variant = 'primary'}: {variant?: 'primary' | 'secondary'}) {
  const {data: session} = useSession();

  return (
    !session ?
      <Button variant={variant} onClick={() => signIn("google")}>
      Sign In with Google
    </Button> :
    <Button variant={variant} onClick={() => signOut()}>
      Sign Out
    </Button>

  )
}
