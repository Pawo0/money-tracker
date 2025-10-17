import client, {ObjectId} from "@/lib/mongodb";
import {NextResponse} from "next/server";
import {auth} from "@/auth"
import {ExpensesData} from "@/types/expenses";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const {id: userId} = session?.user || {};
    const db = client.db("expense-tracker");
    const expensesCollection = db.collection("expenses");

    const expenses = await expensesCollection.find({userId}).sort({date: -1}).toArray();

    return NextResponse.json(expenses, {status: 200});
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({message: "Internal Server Error"}, {status: 500});
  }

}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const {id: userId} = session?.user || {};
    const {date, amount, categoryId, title, description}: ExpensesData = await req.json();

    if (!date || !amount || !categoryId || !title) {
      return NextResponse.json({message: "Missing required fields"}, {status: 400});
    }

    const db = client.db("expense-tracker");
    const expensesCollection = db.collection("expenses");

    const newExpense = {
      userId,
      date,
      amount,
      categoryId,
      title,
      description
    };

    const result = await expensesCollection.insertOne(newExpense);

    return NextResponse.json({...newExpense, _id: result.insertedId}, {status: 201});
  } catch (error) {
    console.error("Error adding expense:", error);
    return NextResponse.json({message: "Internal Server Error"}, {status: 500});
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    const {id: userId} = session?.user || {};
    const {expenseId} = await req.json();

    if (!expenseId) {
      return NextResponse.json({message: "Missing expenseId"}, {status: 400});
    }

    const db = client.db("expense-tracker");
    const expensesCollection = db.collection("expenses");

    const result = await expensesCollection.deleteOne({userId, _id: ObjectId.createFromHexString(expenseId)});

    if (result.deletedCount === 0) {
      return NextResponse.json({message: "Expense not found or unauthorized"}, {status: 404});
    }

    return NextResponse.json({message: "Expense deleted successfully"}, {status: 200});
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json({message: "Internal Server Error"}, {status: 500});
  }
}