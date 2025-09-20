"use client"

import Button from "./Button";
import {signIn, signOut} from "next-auth/react";
import {useSession} from "next-auth/react";

export default function GoogleButton() {
  const {data: session} = useSession();

  return (
    !session ?
    <Button onClick={() => signIn("google")}>
      Sign In with Google
    </Button> :
    <Button onClick={() => signOut()}>
      Sign Out
    </Button>

  )
}
