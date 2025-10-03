"use client"


import React, {useState} from "react";
import {BananaIcon} from "lucide-react";
import type {ExpensesData as InputProps} from "@/types/expenses";
import {useSession} from "next-auth/react";
import AskToLoginPage from "@/components/AskToLoginPage";

export default function Page() {
  const [inputs, setInputs] = useState<InputProps>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    title: "",
    category: "",
    description: ""
  })

  const {data: session} = useSession();
  if (!session){
    return <AskToLoginPage />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const {name} = e.target;
    let {value} = e.target;
    if (name === "amount") {
      if (isNaN(Number(value))) return;
      value = String(Number(value));
    }
    setInputs({
      ...inputs,
      [name]: value
    })
  }

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
      alert("Transaction added successfully")
    } else {
      alert("Failed to add transaction")
    }
  }

  return (
    <>
      <h1>Add transaction</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className={"flex bg-gray-500 p-4 rounded-2xl"}>
          <button className={"flex-1 flex content-center justify-center"}>
            <BananaIcon size={"55"}/>
          </button>
          <div className={"flex flex-3"}>
            <input name={"amount"} type={"text"} placeholder={"0.00"} value={inputs.amount} onChange={handleChange}
                   className={"bg-transparent text-5xl w-full text-right flex-1"}/>
            <span className={"text-3xl content-center px-4 "}>zł</span>
          </div>
        </div>
        <input type={"date"} name={"date"} className={"p-4 rounded-2xl bg-gray-500 text-2xl w-full"}
               value={inputs.date} onChange={handleChange}/>
        <input type={"text"} name={"title"} placeholder={"Title"} className={"p-4 rounded-2xl bg-gray-500 text-2xl"}
               value={inputs.title} onChange={handleChange}/>
        <input type={"text"} name={"category"} placeholder={"Category"}
               className={"p-4 rounded-2xl bg-gray-500 text-2xl"} value={inputs.category} onChange={handleChange}/>

        <textarea name={"description"} placeholder={"Description"} className={"p-4 rounded-2xl bg-gray-500 text-2xl"}
                  value={inputs.description} onChange={handleChange}/>
        <button type={"submit"} className={"p-4 rounded-2xl bg-gray-800 text-2xl cursor-pointer "}>Add transaction</button>

      </form>
    </>
  )
}
