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
      "amount": -4,
      "category": "Rower",
      "title": "Rower"
    },
    {
      "_id": "5",
      "userId": "123",
      "date": "2025-09-16T12:00:00Z",
      "amount": -51,
      "category": "Ananas",
      "title": "Ananas"
    },
    {
      "_id": "6",
      "userId": "123",
      "date": "2025-09-28T12:00:00Z",
      "amount": -12,
      "category": "Kebab z mąką",
      "title": "Kebab z mąką"
    },
    {
      "_id": "7",
      "userId": "123",
      "date": "2025-09-24T12:00:00Z",
      "amount": -33,
      "category": "Płatki z mlekiem",
      "title": "Płatki z mlekiem"
    }
  ]

  return NextResponse.json(list)
}