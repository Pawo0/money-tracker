import type {Session} from "next-auth";
import {auth} from "@/auth";
import AskToLoginPage from "@/components/features/auth/AskToLoginPage";
import HistoryClient from "@/app/history/HistoryClient";

export default async function Page() {
  const session: Session | null = await auth();
  if (!session) {
    return <AskToLoginPage />
  }

  return (
    <>
      <HistoryClient />
    </>
  )
}
