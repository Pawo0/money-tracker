import Button from "@/components/Button/Button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-50 mb-4">
          Money Tracker
        </h1>
        <p className="text-xl text-gray-100 mb-8">
          Track your expenses and manage your budget
        </p>
        <div className="space-x-4">
          <Button>
            <Link href={"/signup"}>
              Get Started
            </Link>
          </Button>
          <Button variant={"secondary"}>
            <Link href={"/signin"}>
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
