import AccountGate from "@/components/features/auth/AccountGate";
import HistoryClient from "./HistoryClient";
export default function Page() {
  return (
    <AccountGate>
      <HistoryClient />
    </AccountGate>
  );
}
