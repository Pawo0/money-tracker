import * as Icons from "lucide-react"

export interface Categories{
  _id?: string;
  name: string;
  icon: keyof typeof Icons;
  color: string;
  baseId?: string;
  userId?: string;
  custom?: boolean;
}