"use client"


import React, {useState} from "react";
import {Banana, BananaIcon, Bus, Gamepad2} from "lucide-react";
import type {ExpensesData as InputProps} from "@/types/expenses";
import {useSession} from "next-auth/react";
import AskToLoginPage from "@/components/AskToLoginPage";
import useExpenses from "@/hooks/useExpenses";
import useModal from "@/hooks/useModal";
import {CategoryModal} from "@/components/CategoryModal";

export default function Page() {
  const [inputs, setInputs] = useState<InputProps>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    title: "",
    category: "",
    description: ""
  })

  const categories = [
  { name: "Jedzenie", icon: Banana, color: "yellow", slug: "food" },
  { name: "Transport", icon: Bus, color: "blue", slug: "transport" },
  { name: "Rozrywka", icon: Gamepad2, color: "purple", slug: "entertainment" },
];

  const {fetchExpenses} = useExpenses()
  const {openModal: open, closeModal: close, isOpen} = useModal()

  const {data: session} = useSession();
  if (!session) {
    return <AskToLoginPage/>
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    if (name === "amount") {
      if (isNaN(Number(value))) return;
    }
    setInputs({
      ...inputs,
      [name]: name === "amount" ? Number(value) : value
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(inputs)
    })
    if (res.ok) {
      setInputs({
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        title: "",
        category: "",
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
            <BananaIcon size={"55"}/>
          </button>

          <div className={"flex flex-3 mx-2 p-4"}>
            <input
              name={"amount"}
              type={"text"}
              placeholder={"0.00"}
              value={inputs.amount === 0 ? "" : inputs.amount}
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

        <input
          type={"text"}
          name={"title"}
          placeholder={"Title"}
          className={"p-4 rounded-2xl bg-gray-500 text-2xl"}
          value={inputs.title}
          onChange={handleChange}
          autoComplete={"off"}
        />

        <input
          type={"text"}
          name={"category"}
          placeholder={"Category"}
          className={"p-4 rounded-2xl bg-gray-500 text-2xl"}
          value={inputs.category}
          onChange={handleChange}
        />


        <textarea
          name={"description"}
          placeholder={"Description"}
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
          categories={categories}
          isOpen={isOpen}
          onCloseAction={close}
          onSelectAction={(cat) => {
          setInputs({...inputs, category: cat})
          close()
        }}/>

      </form>
    </>
  )
}
