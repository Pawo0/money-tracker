import Button from "@/components/ui/Button";
import GoogleButton from "@/components/features/auth/GoogleButton";

export default function Home() {
  return (
    <main className="flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-50 mb-4">
          Money Tracker
        </h1>
        <p className="text-xl text-gray-100 mb-8">
          Track your expenses and manage your budget
        </p>
        <div className="space-x-4">
          <Button variant={"primary"} href={"/dashboard"} onlyForUsers>
            Dashboard
          </Button>

          <GoogleButton variant={"secondary"}/>
        </div>
      </div>
    </main>
  );
}
