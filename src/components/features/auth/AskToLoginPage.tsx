import GoogleButton from "@/components/features/auth/GoogleButton";
import { Wallet, ArrowUpRight } from "lucide-react";
export default function AskToLoginPage() {
  return (
    <main className="login-page">
      <div className="login-art">
        <Wallet size={36} />
        <span className="eyebrow">A SPACE FOR YOUR FINANCES</span>
        <h1>
          A fresh start.
          <br />A clearer picture.
        </h1>
        <p>
          Your expenses, their stories, and your monthly overview. All in one
          calm, considered space.
        </p>
        <ArrowUpRight size={42} />
      </div>
      <div className="login-content">
        <span className="eyebrow">WELCOME TO YOUR SPACE</span>
        <h2>Make yourself at home.</h2>
        <p>
          Sign in to see your expenses and pick up right where you left off.
        </p>
        <GoogleButton />
        <span className="login-hint">
          Use your Google account to get started.
        </span>
      </div>
    </main>
  );
}
