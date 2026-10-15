import { ArrowRight, LockKeyhole, Wallet } from "lucide-react";
import DemoButton from "./DemoButton";
import GoogleButton from "./GoogleButton";
import Link from "next/link";
export default function AskToLoginPage() {
  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <span className="auth-icon">
          <Wallet size={30} />
        </span>
        <span className="eyebrow">YOUR MONEY, YOUR PEACE OF MIND</span>
        <h1>
          Make room for
          <br />
          better habits.
        </h1>
        <p>
          Keep track of your expenses and see where your money goes. Sign in to
          start building a clearer picture of your finances.
        </p>
        <DemoButton />
        <div className="auth-divider">or use your own account</div>
        <GoogleButton variant="secondary" />
        <span className="auth-security">
          <LockKeyhole size={13} /> Your expenses are only visible to you
        </span>
        <Link className="text-link" href="/">
          Explore the preview <ArrowRight size={15} />
        </Link>
      </div>
    </main>
  );
}
