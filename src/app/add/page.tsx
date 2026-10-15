"use client";

import React, { useRef, useState } from "react";
import type { ExpensesInputData as InputProps } from "@/types/expenses";
import { useSession } from "next-auth/react";
import AskToLoginPage from "@/components/features/auth/AskToLoginPage";
import useExpenses from "@/hooks/useExpenses";
import useModal from "@/hooks/useModal";
import CategoryModal from "@/components/features/categories/CategoryModal";
import CurrentCategoryIcon from "@/components/features/categories/CurrentCategoryIcon";
import { Calendar, Loader2, X, PenLine } from "lucide-react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Plus, ChevronDown, ArrowUpRight } from "lucide-react";

export default function Page() {
  const { fetchExpenses } = useExpenses();
  const { openModal: open, closeModal: close, isOpen } = useModal();
  const { data: session } = useSession();
  const amountRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputs, setInputs] = useState<InputProps>({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    title: "",
    category: null,
    description: "",
  });

  if (!session) {
    return <AskToLoginPage />;
  }

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "amount") {
      const normalizedValue = value.replace(",", ".");

      // Number with up to two decimal places
      const regex = /^\d*\.?\d{0,2}$/;

      if (!regex.test(normalizedValue)) return;

      setInputs({ ...inputs, amount: normalizedValue });
      return;
    }

    setInputs({ ...inputs, [name]: value });
  };

  const handleQuickAmount = (val: number) => {
    const current = parseFloat(inputs.amount || "0");
    const newVal = (current + val).toFixed(2);
    setInputs({ ...inputs, amount: newVal });
  };

  const handleClearAmount = () => {
    setInputs({ ...inputs, amount: "" });
    if (amountRef.current) {
      amountRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.amount || !inputs.category) {
      toast.warning("Enter an amount and choose a category.");
      return;
    }

    setIsSubmitting(true);
    const amount = parseFloat(inputs.amount) * -1;

    const payload = {
      ...inputs,
      title: inputs.title || inputs.category.name,
      // categoryId: inputs.category._id,
      amount: amount,
    };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setInputs({
          date: new Date().toISOString().split("T")[0],
          amount: "",
          title: "",
          category: null,
          description: "",
        });
        await fetchExpenses();
        toast.success("Expense saved. All taken care of.");
      } else {
        toast.error("Could not save your expense. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            A SMALL STEP TOWARDS A CLEARER PICTURE
          </span>
          <h1>Add expense</h1>
          <p>Note it now. Clear your mind for later.</p>
        </div>
      </div>
      <div className="add-layout">
        <form onSubmit={handleSubmit} className="expense-form">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            theme="light"
            transition={Bounce}
          />
          <section className="amount-section">
            <label htmlFor="amount" className="small-label">
              HOW MUCH DID YOU SPEND?
            </label>
            <div className="amount-input-wrap">
              <input
                id="amount"
                ref={amountRef}
                name="amount"
                type="text"
                placeholder="0.00"
                value={inputs.amount}
                onChange={handleChange}
                inputMode="decimal"
                className="amount-input"
                autoComplete="off"
                autoFocus
              />
              <span>zł</span>
              {inputs.amount && (
                <button
                  type="button"
                  onClick={handleClearAmount}
                  className="clear-amount"
                  aria-label="Clear amount"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="quick-amounts">
              <span>Quick add</span>
              {[1, 5, 10, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                >
                  +{val}
                </button>
              ))}
            </div>
          </section>
          <div className="form-fields">
            <div className="form-section-heading">
              <span className="section-number">01</span>
              <h2>Expense details</h2>
            </div>
            <div className="field-group">
              <label id="category-label">
                Category <span className="required-mark">*</span>
              </label>
              <button
                className="category-picker"
                aria-labelledby="category-label category-value"
                type="button"
                onClick={open}
              >
                <span className="category-icon">
                  <CurrentCategoryIcon
                    categoryName={inputs.category?.icon}
                    size={21}
                  />
                </span>
                <span id="category-value">
                  {inputs.category?.name || "Choose a category"}
                </span>
                <ChevronDown size={17} />
              </button>
            </div>
            <div className="form-field-grid">
              <div className="field-group">
                <label htmlFor="title">
                  Title <span className="optional-label">optional</span>
                </label>
                <div className="input-with-icon">
                  <PenLine size={17} />
                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder={
                      inputs.category
                        ? inputs.category.name
                        : "e.g. Groceries for dinner"
                    }
                    value={inputs.title}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="field-group">
                <label htmlFor="date">Date</label>
                <div className="input-with-icon">
                  <Calendar size={17} />
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={inputs.date}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="description">
                Note <span className="optional-label">optional</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Anything you’d like to remember about this expense?"
                value={inputs.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-submit-row">
              <span>* Amount and category are required</span>
              <button type="submit" className="button button-primary">
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Save expense
                  </>
                )}
              </button>
            </div>
          </div>
          <CategoryModal
            isOpen={isOpen}
            onCloseAction={close}
            onSelectAction={(category) => setInputs({ ...inputs, category })}
          />
        </form>
        <aside className="form-aside">
          <span className="small-label">A LITTLE HELPFUL NOTE</span>
          <ArrowUpRight size={25} />
          <h2>
            Every entry.
            <br />A clearer picture.
          </h2>
          <p>
            Choose a category to make sense of your everyday spending habits.
          </p>
          <div className="aside-rule" />
          <p>No title in mind? We’ll use the name of your chosen category.</p>
          <span className="aside-footer">SMALL STEPS. BETTER DECISIONS.</span>
        </aside>
      </div>
    </main>
  );
}
