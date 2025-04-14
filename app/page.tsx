import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import LoginForm from "@/components/login-form"

export default async function Home() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")

  if (authToken) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}
