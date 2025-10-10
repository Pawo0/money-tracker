import {clsx, ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import * as Icons from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getIconByName(name: string){
  const Icon = (Icons as any)[name];
  return Icon ? Icon : Icons.HelpCircle;
}