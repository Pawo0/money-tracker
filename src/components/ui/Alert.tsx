import { CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
}

export default function Alert({ message, type = "info" }: AlertProps) {
  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  }[type];
  return (
    <div
      className={`app-alert app-alert-${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      <Icon size={19} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
