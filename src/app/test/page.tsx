import ExpenseChart from "@/components/ExpenseChart";
import {auth} from "@/auth"
import type { Session } from "next-auth";

export default async function DashboardPage() {
  const session: Session | null = await auth();
  if (!session){
    return <main>
      You have to be logged
    </main>
  }

  const user = session.user
  return (
    <main className="bg-black/80 rounded-2xl p-6 w-full">
      <h1 className="text-xl font-semibold">Dobry wieczór, {user?.name}</h1>

      <div className="mt-6 grid gap-4">
        {/* Sekcja konta */}
        <div className="p-4 bg-gray-800 rounded-2xl">
          <p className="text-sm text-gray-400">Bank</p>
          <p className="text-2xl font-bold">-23 zł</p>
          <p className="text-xs text-gray-400">1 transakcja</p>
        </div>

        {/* Wykres */}
        <ExpenseChart />

        {/* Ostatnie transakcje */}
        <div className="p-4 bg-gray-800 rounded-2xl">
          <p className="text-gray-400 text-sm mb-2">Dzisiaj, 25 września</p>
          <div className="flex justify-between items-center">
            <p>🍔 Jedzenie poza domem</p>
            <p className="text-red-400">-23 zł</p>
          </div>
        </div>
      </div>
    </main>
  );
}
