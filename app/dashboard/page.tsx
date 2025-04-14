import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Header from "@/components/header"
import PostGrid from "@/components/post-grid"
import Pagination from "@/components/pagination"
import { Skeleton } from "@/components/ui/skeleton"

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")

  if (!authToken) {
    redirect("/")
  }

  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams?.page) || 1

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<PostGridSkeleton />}>
          <PostGrid page={page} />
        </Suspense>
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={page} />
        </div>
      </div>
    </main>
  )
}

function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-slate-800 rounded-lg overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}
