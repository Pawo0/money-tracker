import LatestTransaction from "@/components/LatestTransactions";
import type {Session} from "next-auth";
import {auth} from "@/auth";
import AskToLoginPage from "@/components/AskToLoginPage";

export default async function Page() {
  const session: Session | null = await auth();
  if (!session) {
    return <AskToLoginPage />
  }

  return (
    <>
      <h1>History</h1>
      <LatestTransaction showAll />
    </>
  )
}
