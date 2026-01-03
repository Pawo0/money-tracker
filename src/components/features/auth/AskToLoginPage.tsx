import Alert from "@/components/ui/Alert";
import GoogleButton from "@/components/features/auth/GoogleButton";

export default function AskToLoginPage() {
  return (
    <>
      <Alert message={"You have to be logged in to view this page"} type="error"/>
      <GoogleButton className={"mx-auto"} />
    </>
  )
}