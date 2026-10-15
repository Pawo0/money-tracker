import Button from "@/components/ui/Button";
import GoogleButton from "@/components/features/auth/GoogleButton";
import {
  ArrowUpRight,
  ArrowRight,
  Wallet,
  ShoppingBag,
  Coffee,
  ReceiptText,
  Check,
} from "lucide-react";

export default function Home() {
  return (
    <main className="home-page">
      <div className="home-topline">
        <span className="eyebrow">YOUR MONEY. A CLEARER PICTURE.</span>
        <span className="edition">PERSONAL. SIMPLE. CONSIDERED.</span>
      </div>
      <section className="home-hero">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span />A little less guesswork. A little more clarity.
          </div>
          <h1>
            Little expenses.
            <br />
            Big <span>picture.</span>
          </h1>
          <p>
            Know where your money goes. Keep track of the everyday, understand
            your habits, and see your month with a little more clarity.
          </p>
          <div className="hero-actions">
            <GoogleButton />
            <Button href="/dashboard" variant="secondary" onlyForUsers>
              Open overview <ArrowUpRight size={17} />
            </Button>
          </div>
          <div className="hero-footnote">
            <Check size={15} /> Your money. Your own pace.
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-grid" />
          <span className="art-index">01 / EVERYDAY PEACE OF MIND</span>
          <div className="wallet-art">
            <Wallet size={28} />
            <span>YOUR WORKSPACE</span>
            <strong>
              A little more
              <br />
              in control<span>.</span>
            </strong>
            <div className="wallet-bottom">
              <span>MONEY TRACKER</span>
              <ArrowUpRight size={23} />
            </div>
          </div>
          <div className="receipt-art">
            <div className="receipt-heading">
              <ReceiptText size={18} />
              <span>The little everyday things</span>
            </div>
            <div>
              <span className="art-category">
                <ShoppingBag size={17} />
              </span>
              <span>Groceries</span>
              <Check size={15} />
            </div>
            <div>
              <span className="art-category">
                <Coffee size={17} />
              </span>
              <span>A moment for yourself</span>
              <Check size={15} />
            </div>
            <div className="receipt-bottom">Noted. Sorted. Taken care of.</div>
          </div>
          <span className="art-bottom">
            GOOD HABITS START WITH A SINGLE EXPENSE.
          </span>
        </div>
      </section>
      <section className="home-principles">
        <div>
          <span className="step-number">01</span>
          <h2>Keep it simple</h2>
          <p>
            An amount, a category, and you’re done. Give every expense a place.
          </p>
        </div>
        <div>
          <span className="step-number">02</span>
          <h2>See the bigger picture</h2>
          <p>A monthly summary and a clear chart help you see your spending.</p>
        </div>
        <div>
          <span className="step-number">03</span>
          <h2>Stay in the know</h2>
          <p>Your full transaction history, ready whenever you need it.</p>
          <ArrowRight size={18} />
        </div>
      </section>
    </main>
  );
}
