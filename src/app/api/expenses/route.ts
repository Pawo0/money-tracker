import client from "@/lib/mongodb";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
  try {
    const db = client.db("expense-tracker");
    const expensesCollection = db.collection("expenses");

    const expenses = await expensesCollection.find().sort({date: -1}).toArray();

    return NextResponse.json(expenses, {status: 200});
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({message: "Internal Server Error"}, {status: 500});
  }
  
}

export async function POST(req: Request) {
  try {
    const {date, amount, category, title, description} = await req.json();

    if (!date || !amount || !category || !title) {
      return NextResponse.json({message: "Missing required fields"}, {status: 400});
    }

    const db = client.db("expense-tracker");
    const expensesCollection = db.collection("expenses");

    const newExpense = {
      date,
      amount,
      category,
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