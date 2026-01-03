interface AlertProps {
  message: string,
  type?: 'success' | 'error' | 'info' | 'warning'
}

import {CheckCircle, Info, AlertTriangle, XCircle} from "lucide-react"

export default function Alert({message, type}: AlertProps) {
  const typeStyles = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800"
  }

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle
  }[type || 'info']

  return (
    <div className={`flex items-center p-4 rounded-lg ${typeStyles[type || 'info']}`}>
      <Icon className="w-6 h-6 mr-2"/>
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}