"use client"


import React, {useState} from "react";
import type {ExpensesInputData as InputProps} from "@/types/expenses";
import {useSession} from "next-auth/react";
import AskToLoginPage from "@/components/AskToLoginPage";
import useExpenses from "@/hooks/useExpenses";
import useModal from "@/hooks/useModal";
import CategoryModal from "@/components/CategoryModal";
import CurrentCategoryIcon from "@/components/CurrentCategoryIcon";
import {cn} from "@/lib/utils";
import {ArrowDown} from "lucide-react";

export default function Page() {
  const [inputs, setInputs] = useState<InputProps>({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    title: "",
    category: null,
    description: ""
  })


  const {fetchExpenses} = useExpenses()
  const {openModal: open, closeModal: close, isOpen} = useModal()

  const {data: session} = useSession();
  if (!session) {
    return <AskToLoginPage/>
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = parseFloat(inputs.amount || "0") * -1; // For now, we assume all transactions are expenses

    const payload = {
      ...inputs,
      categoryId: inputs.category?._id || "Uncategorized",
      amount: amount
    }
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      setInputs({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        title: "",
        category: null,
        description: ""
      })
      await fetchExpenses()
      alert("Transaction added successfully")
    } else {
      alert("Failed to add transaction")
    }
  }

  return (
    <>
      <h1>Add transaction</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className={"flex bg-gray-500 pr-4 rounded-2xl"}>

          <button
            className={"flex-1 flex py-4 content-center justify-center border-r border-gray-400 rounded-l-2xl cursor-pointer hover:bg-gray-400"}
            type={"button"}
            onClick={open}
          >
            <CurrentCategoryIcon categoryName={inputs.category?.icon} size={55}/>
          </button>

          <div className={"flex flex-3 mx-2 p-4"}>
            <input
              name={"amount"}
              type={"text"}
              placeholder={"0.00"}
              value={inputs.amount}
              onChange={handleChange}
              className={"text-5xl w-full text-right flex-1 focus:outline-hidden"}
              autoComplete={"off"}
            />
            <label htmlFor={"amount"} className={"text-3xl content-center px-4"}>
              zł
            </label>
          </div>
        </div>

        <input
          type={"date"}
          name={"date"}
          className={"p-4 rounded-2xl bg-gray-500 text-2xl w-full"}
          value={inputs.date}
          onChange={handleChange}
        />

        <button
          name={"category"}
          className={
            cn("p-4 rounded-2xl bg-gray-500 text-2xl text-left flex justify-between items-center cursor-pointer",
              !inputs.category && "text-gray-400"
            )
          }
          value={inputs.category?.name}
          type={"button"}
          onClick={open}
        >
          <span className={""}>
            {inputs.category ? inputs.category.name : "Select category"}
          </span>
          <span className={""}>
            <ArrowDown color={"#c3c7cd"}/>
          </span>
        </button>

        <input
          type={"text"}
          name={"title"}
          placeholder={"Title"}
          className={"p-4 rounded-2xl bg-gray-500 text-2xl"}
          value={inputs.title}
          onChange={handleChange}
          autoComplete={"off"}
        />


        <textarea
          name={"description"}
          placeholder={"Description (optional)"}
          className={"p-4 rounded-2xl bg-gray-500 text-2xl"}
          value={inputs.description}
          onChange={handleChange}
        />

        <button
          type={"submit"}
          className={"p-4 rounded-2xl bg-green-600 text-2xl cursor-pointer "}
        >
          Add transaction
        </button>

        <CategoryModal
          isOpen={isOpen}
          onCloseAction={close}
          onSelectAction={(category) => setInputs({
            ...inputs,
            category
          })}
        />

      </form>
    </>
  )
}
