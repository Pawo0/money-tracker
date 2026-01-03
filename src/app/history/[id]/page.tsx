"use client"

import React, {useEffect, useState} from "react"
import {useRouter, useParams} from "next/navigation"
import {ArrowLeft, Calendar, FileText, Tag, Trash2, Loader2, Clock, SquarePen} from "lucide-react"
import CurrentCategoryIcon from "@/components/features/categories/CurrentCategoryIcon"
import type {ExpensesData} from "@/types/expenses"
import useExpenses from "@/hooks/useExpenses";


export default function TransactionDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const {id} = params

  const [expense, setExpense] = useState<ExpensesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const {fetchExpenses} = useExpenses()


  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetch(`/api/expenses/${id}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setExpense(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchTransaction()
  }, [id])

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?")
    if (!confirmed) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        await fetchExpenses()
        router.back()
        router.refresh()
      } else {
        alert("There was an error deleting the transaction.")
      }
    } catch (error) {
      console.error(error)
      alert("Server error occurred while deleting the transaction.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full animate-pulse gap-6">
        <div className="h-8 w-8 bg-gray-700 rounded-full mb-4"></div>
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="h-24 w-24 bg-gray-700 rounded-full"></div>
          <div className="h-10 w-48 bg-gray-700 rounded-xl"></div>
          <div className="h-6 w-32 bg-gray-800 rounded-xl"></div>
        </div>
        <div className="space-y-4">
          <div className="h-16 w-full bg-gray-800 rounded-2xl"></div>
          <div className="h-16 w-full bg-gray-800 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  if (!expense) return <p className="text-center text-gray-400 mt-10">Transaction not found</p>

  return (
    <div className={`flex flex-col h-full relative`}>
      <div className="flex items-center  mb-4">
        <div className="flex-1">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
          >
            <ArrowLeft size={28}/>
          </button>
        </div>
        <span className="flex-1 text-gray-500 text-sm font-medium uppercase tracking-wider text-center">Details</span>
        <div className="flex-1"></div>
      </div>

      <div className="flex flex-col items-center justify-center py-6 mb-6 relative">
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-20"
          style={{backgroundColor: expense.category?.color || '#555'}}
        ></div>
        <div className="mb-4 p-1 rounded-full border-4 border-gray-800 shadow-xl ">
          <CurrentCategoryIcon categoryName={expense.category?.icon} size={80}/>
        </div>

        <h1 className="text-5xl font-bold text-white mb-2">
          {expense.amount.toLocaleString("pl-PL", {minimumFractionDigits: 2})}
          <span className="text-2xl text-gray-500 font-normal ml-2">zł</span>
        </h1>
        <p className="text-xl text-gray-400 font-medium">{expense.title}</p>
      </div>

      <div className="flex flex-col gap-3 flex-1 overfl ow-y-auto custom-scrollbar">

        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50">
          <div className="p-3 bg-gray-800 rounded-xl text-gray-400">
            <Calendar size={24}/>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs uppercase">Transaction date</span>
            <span className="text-gray-200 text-lg">
                    {new Date(expense.date).toLocaleDateString("en-EN", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                </span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50">
          <div className="p-3 bg-gray-800 rounded-xl text-gray-400">
            <Tag size={24}/>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs uppercase">Kategoria</span>
            <span className="text-gray-200 text-lg flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{backgroundColor: expense.category?.color}}
                    ></span>
              {expense.category?.name}
                </span>
          </div>
        </div>

        {expense.description && (
          <div className="flex flex-col gap-2 p-5 bg-gray-800/50 rounded-2xl border border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FileText size={16}/>
              <span className="text-xs uppercase">Description</span>
            </div>
            <p className="text-gray-300 text-base leading-relaxed italic">
              {'"' + expense.description + '"'}
            </p>
          </div>
        )}

        {expense.created_at && (
          <div className="flex items-center justify-center gap-2 mt-2 opacity-30">
            <Clock size={12} className="text-gray-400"/>
            <p className="text-xs text-center text-gray-400">
              Created: {new Date(expense.created_at).toLocaleString("en-EN", {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            }
            </p>
          </div>
        )}
        {expense.updated_at && expense.updated_at !== expense.created_at && (
          <div className="flex items-center justify-center gap-2 mt-2 opacity-30">
            <SquarePen size={12} className="text-gray-400"/>
            <p className="text-xs text-center text-gray-400">
              Created: {new Date(expense.updated_at).toLocaleString("en-EN", {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            }
            </p>
          </div>
        )
        }
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 text-lg font-semibold hover:bg-red-500 hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isDeleting ? (
            <Loader2 className="animate-spin"/>
          ) : (
            <>
              <Trash2 size={20}/> Delete Transaction
            </>
          )}
        </button>
      </div>
    </div>
  )
}