import client, {ObjectId} from "@/lib/mongodb";
import {NextResponse} from "next/server";
import {auth} from "@/auth"


export async function GET(_req: Request, {params}: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  try {
    const session = await auth();
    const {id: userId} = session?.user || {};
    const db = client.db("expense-tracker");
    const expensesCollection = db.collection("expenses");

    const expense = await expensesCollection.findOne({_id: new ObjectId(id), userId});

    if (!expense) {
      return NextResponse.json({message: "Expense not found"}, {status: 404});
    }

    return NextResponse.json(expense, {status: 200});
  }
  catch (error) {
    console.error("Error fetching expense:", error);
  }
}

export async function DELETE(_req: Request, {params}: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  try{
    const session = await auth();
    const {id: userId} = session?.user || {};
    const db = client.db("expense-tracker");
    const expensesCollection = db.collection("expenses");

    const result = await expensesCollection.deleteOne({_id: new ObjectId(id), userId});

    if (result.deletedCount === 0) {
      return NextResponse.json({message: "Expense not found or not authorized"}, {status: 404});
    }

    return NextResponse.json({message: "Expense deleted successfully"}, {status: 200});
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
}

export async function PATCH(req: Request, {params}: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  try {
    const session = await auth();
    const {id: userId} = session?.user || {};
    const {date, amount, category, title, description} = await req.json();

    const db = client.db("expense-tracker");
    const expensesCollection = db.collection("expenses");

    const currentExpense = await expensesCollection.findOne({_id: new ObjectId(id), userId});
    if (!currentExpense) {
      return NextResponse.json({message: "Expense not found or not authorized"}, {status: 404});
    }

    const updatedExpense = {
      date: date || currentExpense.date,
      amount: amount || currentExpense.amount,
      category: category || currentExpense.category,
      title: title || currentExpense.title,
      description: description !== undefined ? description : currentExpense.description,
      updated_at: new Date()
    };

    const updated = await expensesCollection.updateOne(
      {_id: new ObjectId(id), userId},
      {$set: updatedExpense}
    );

    if (updated.modifiedCount === 0) {
      return NextResponse.json({message: "No changes made to the expense"}, {status: 200});
    }

    return NextResponse.json({message: "Expense updated successfully"}, {status: 200});

  }
  catch (error) {
    console.error("Error updating expense:", error);

  }
}