import Alert from "@/components/Alert";
import GoogleButton from "@/components/GoogleButton";

export default function AskToLoginPage() {
  return (
    <>
      <Alert message={"You have to be logged in to view this page"} type="error"/>
      <GoogleButton className={"mx-auto"} />
    </>
  )
}