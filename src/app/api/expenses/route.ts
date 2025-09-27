import client from "@/lib/mongodb";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
  const list = [
    {
      "_id": "1",
      "userId": "123",
      "date": "2025-09-20T12:00:00Z",
      "amount": -23,
      "category": "Jedzenie poza domem",
      "title": "Jedzenie poza domem"
    },
    {
      "_id": "2",
      "userId": "123",
      "date": "2025-09-21T12:00:00Z",
      "amount": -5,
      "category": "Hot-dog",
      "title": "Hot-dog"
    },
    {
      "_id": "3",
      "userId": "123",
      "date": "2025-09-22T12:00:00Z",
      "amount": -11,
      "category": "Kosmetyki",
      "title": "Kosmetyki"
    },
    {
      "_id": "4",
      "userId": "123",
      "date": "2025-09-22T12:00:00Z",
      "amount": -7,
      "category": "Rower",
      "title": "Rower"
    }
  ]

  return NextResponse.json(list)
}