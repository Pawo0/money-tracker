"use client"

import React, {useRef, useState} from "react";
import type {ExpensesInputData as InputProps} from "@/types/expenses";
import {useSession} from "next-auth/react";
import AskToLoginPage from "@/components/AskToLoginPage";
import useExpenses from "@/hooks/useExpenses";
import useModal from "@/hooks/useModal";
import CategoryModal from "@/components/CategoryModal";
import CurrentCategoryIcon from "@/components/CurrentCategoryIcon";
import {Calendar, Loader2, X, PenLine} from "lucide-react";
import {ToastContainer, toast, Bounce} from "react-toastify";
import {cn} from "@/lib/utils/ui";

export default function Page() {
  const {fetchExpenses} = useExpenses();
  const {openModal: open, closeModal: close, isOpen} = useModal();
  const {data: session} = useSession();
  const amountRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputs, setInputs] = useState<InputProps>({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    title: "",
    category: null,
    description: "",
  });

  if (!session) {
    return <AskToLoginPage/>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;

    if (name === "amount") {
      const normalizedValue = value.replace(",", ".");

      // Number with up to two decimal places
      const regex = /^\d*\.?\d{0,2}$/;

      if (!regex.test(normalizedValue)) return;

      setInputs({...inputs, amount: normalizedValue});
      return;
    }

    setInputs({...inputs, [name]: value});
  };

  const handleQuickAmount = (val: number) => {
    const current = parseFloat(inputs.amount || "0");
    const newVal = (current + val).toFixed(2);
    setInputs({...inputs, amount: newVal});
  };

  const handleClearAmount = () => {
    setInputs({...inputs, amount: ""});
    if (amountRef.current) {
      amountRef.current.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.amount || !inputs.category) {
      toast.warning("Please fill in all required fields.");
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
        headers: {"Content-Type": "application/json"},
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
        toast.success('🦄 Success!');
      } else {
        toast.error("An error occurred while adding the transaction.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <div className="flex flex-col gap-3">
          <div
            className="relative flex items-center bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-700 transition-colors focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500/50">
            <input
              ref={amountRef}
              name="amount"
              type="text"
              placeholder="0.00"
              value={inputs.amount}
              onChange={handleChange}
              inputMode="decimal"
              className="w-full bg-transparent text-5xl font-bold text-white placeholder-gray-600 focus:outline-hidden text-right"
              autoComplete="off"
              autoFocus
            />
            {inputs.amount && (
              <button
                type="button"
                onClick={handleClearAmount}
                className="absolute right-4 top-4 text-gray-500 hover:text-white"
              >
                <X size={20}/>
              </button>
            )}
            <span className="text-gray-400 text-4xl font-light mr-2 px-2">zł</span>
          </div>


          <div className="flex gap-2 justify-end px-2 overflow-x-auto no-scrollbar">
            {[1, 5, 10, 50, 100].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAmount(val)}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300 hover:bg-gray-700 hover:border-gray-500 transition-all active:scale-95"
              >
                +{val}
              </button>
            ))}
          </div>
        </div>

        <div className="flex bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-sm">
          <button
            className={cn(
              "flex items-center justify-center w-20 bg-gray-700/50 border-r border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer active:bg-gray-600",
              !inputs.category && "bg-gray-800"
            )}
            type="button"
            onClick={open}
            title="Select category"
          >
            {inputs.category ? (
              <CurrentCategoryIcon categoryName={inputs.category.icon} size={32} className="text-white drop-shadow-md"/>
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-500">
                <span className="text-xl text-gray-400">?</span>
              </div>
            )}
          </button>


          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <PenLine size={18}/>
            </div>
            <input
              type="text"
              name="title"
              placeholder={inputs.category ? inputs.category.name : "Title"}
              className="w-full p-4 pl-12 bg-transparent text-xl text-white placeholder-gray-500 focus:outline-hidden focus:bg-gray-700/30 transition-colors"
              value={inputs.title}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>


        <div
          className="relative bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
            <Calendar size={22}/>
          </div>
          <input
            type="date"
            name="date"
            className="w-full p-4 pl-12 bg-transparent text-xl text-white focus:outline-hidden appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full cursor-pointer"
            value={inputs.date}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="description"
          placeholder="Description (optional)"
          className="p-4 rounded-2xl bg-gray-800 border border-gray-700 text-lg text-white placeholder-gray-500 focus:outline-hidden focus:ring-1 focus:ring-green-500/50 resize-none h-32"
          value={inputs.description}
          onChange={handleChange}
        />

        <button
          type="submit"
          // disabled={isSubmitting || !inputs.amount || !inputs.category}
          className="mt-2 p-5 rounded-2xl bg-green-600 text-white text-xl font-semibold shadow-lg hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin"/> Submitting...
            </>
          ) : (
            "Add Transaction"
          )}
        </button>

        <CategoryModal
          isOpen={isOpen}
          onCloseAction={close}
          onSelectAction={(category) => setInputs({
            ...inputs,
            category,
            title: category.name
          })}
        />
      </form>
    </div>
  )
}