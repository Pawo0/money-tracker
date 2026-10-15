import { auth } from "@/auth";
import DashboardView from "@/components/features/dashboard/DashboardView";
export default async function DashboardPage() {
  const session = await auth();
  return <DashboardView demo={!session} name={session?.user?.name} />;
}
