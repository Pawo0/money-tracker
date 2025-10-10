import {NextResponse} from "next/server";
import client from "@/lib/mongodb";
import {auth} from "@/auth"
import type {Categories} from "@/types/categories";



export async function GET() {
  // const defaultCategories = [
  //   {name: "Jedzenie", icon: Banana, color: "yellow", slug: "default1"},
  //   {name: "Transport", icon: Bus, color: "blue", slug: "default2"},
  //   {name: "Rozrywka", icon: Gamepad2, color: "purple", slug: "default3"},
  // ]

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const db = client.db("expense-tracker");
    const defaultCategories = await db.collection<Categories>("defaultCategories").find().toArray();
    const categories = await db.collection<Categories>("categories").find({userId: session?.user?.id}).toArray();

    const overrides = new Map(
      categories
        .filter(cat => cat.baseId)
        .map(cat => [cat.baseId, cat])
    )

    const mergedCategories = defaultCategories.map(cat => {
      const override = overrides.get(cat._id?.toString() || "");
      return override ? {...cat, ...override, _id: override._id} : cat;
    });

    const customCategories = categories.filter(cat => !cat.baseId);
    mergedCategories.push(...customCategories);

    return NextResponse.json(mergedCategories, {status: 200});

  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }

}