import * as Icons from "lucide-react"

export type IconNames = keyof typeof Icons;

export interface Categories{
  _id?: string;
  name: string;
  icon: IconNames;
  color: string;
  baseId?: string;
  userId?: string;
  custom?: boolean;
}